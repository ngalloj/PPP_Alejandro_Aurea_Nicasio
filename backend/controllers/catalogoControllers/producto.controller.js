// Controlador para gestionar Productos (CRUD).
const db = require("../../models");
// Se importan los modelos Elemento y Producto para gestionar la relación entre ambos.
const Elemento = db.Elemento;
// Producto extiende de Elemento, por lo que su clave primaria es idElemento, que también es clave foránea a Elemento.
const Producto = db.Producto;
// Se importa Cloudinary para gestionar las imágenes asociadas a los productos.
const cloudinary = require('cloudinary').v2;

// Función auxiliar para filtrar solo las propiedades definidas (no undefined) de un objeto.
function pickDefined(obj) {
  const out = {};
  Object.keys(obj).forEach((k) => {
    if (obj[k] !== undefined) out[k] = obj[k];
  });
  return out;
}

// =======================
// CREAR PRODUCTO
// =======================
// Para crear un Producto, primero creamos el Elemento asociado y luego el Producto que referencia al Elemento. Si se incluye una imagen, se sube a Cloudinary y se guarda la URL en la base de datos.
exports.create = async (req, res) => {
  const t = await db.sequelize.transaction();
  // En la creación de un Producto, validamos que se reciban los campos obligatorios (nombre, precio, tipo, stock, stockMinimo). Si falta alguno, devolvemos un error 400. Luego, si se incluye una imagen, la subimos a Cloudinary y guardamos la URL. Finalmente, creamos el Elemento y el Producto dentro de una transacción para asegurar la integridad de los datos.
  try {
    if (
      !req.body.nombre ||
      req.body.precio === undefined ||
      !req.body.tipo ||
      req.body.stock === undefined ||
      req.body.stockMinimo === undefined
    ) {
      await t.rollback();
      return res.status(400).send({
        message: "nombre, precio, stock, stockMinimo y tipo son obligatorios."
      });
    }
// Inicialmente, la URL de la foto es null (sin imagen)
    let fotoUrl = null;

    // Si viene fichero, súbelo a Cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'clinica/productos',
      });
      fotoUrl = result.secure_url; // URL https que guardaremos en Aiven
    }

    // Primero creamos el Elemento, luego el Producto que referencia al Elemento creado.
    const elemento = await Elemento.create({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      precio: req.body.precio
    }, { transaction: t });

    // Luego creamos el Producto con el idElemento del Elemento recién creado y el resto de datos específicos de Producto.
    const producto = await Producto.create({
      idElemento: elemento.idElemento,
      stock: req.body.stock,
      stockMinimo: req.body.stockMinimo,
      tipo: req.body.tipo,
      foto: fotoUrl
    }, { transaction: t });

    await t.commit();
// Finalmente, devolvemos el nuevo Producto creado, incluyendo los datos del Elemento asociado.
    const data = await Producto.findByPk(producto.idElemento, {
      include: [{ model: Elemento, as: "Elemento" }]
    });

    return res.send(data);
  } catch (err) {
    await t.rollback();
    return res.status(500).send({ message: err.message || "Error creando Producto." });
  }
};

// =======================
// LISTAR / OBTENER
// =======================
// Al listar o buscar un Producto, incluimos también los datos del Elemento asociado.
exports.findAll = async (req, res) => {
  try {
    const data = await Producto.findAll({
      include: [{ model: Elemento, as: "Elemento" }]
    });
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error listando Productos." });
  }
};
// Al buscar un Producto por id, incluimos también los datos del Elemento asociado.
exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Producto.findByPk(id, {
      include: [{ model: Elemento, as: "Elemento" }]
    });
    if (!data) return res.status(404).send({ message: `Producto no encontrado idElemento=${id}` });
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error obteniendo Producto." });
  }
};

// =======================
// ACTUALIZAR PRODUCTO
// =======================
// Para actualizar un Producto, podemos recibir datos tanto para el Elemento (nombre, descripcion, precio) como para el Producto (stock, stockMinimo, tipo, foto). Además, gestionamos la actualización de la foto con Cloudinary y la opción de eliminarla.
exports.update = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const id = req.params.id;

    let nuevaFotoUrl; // undefined = no tocar, null = borrar, string = nueva URL

    const removeImage =
      req.body.removeImage === true ||
      req.body.removeImage === 'true' ||
      req.body.removeImage === '1' ||
      req.body.removeImage === 1;

    if (removeImage) {
      nuevaFotoUrl = null;
    } else if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'clinica/productos',
      });
      nuevaFotoUrl = result.secure_url;
    }

    const elementoData = pickDefined({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      precio: req.body.precio
    });

    const productoData = pickDefined({
      stock: req.body.stock,
      stockMinimo: req.body.stockMinimo,
      tipo: req.body.tipo
    });

    // foto solo se añade si queremos cambiarla
    if (nuevaFotoUrl !== undefined) {
      productoData.foto = nuevaFotoUrl;
    }
// Primero actualizamos el Elemento (si hay datos para actualizar), luego el Producto (si hay datos para actualizar o si el Producto existe). Si no se encuentra el Producto, no se actualiza nada. Finalmente, devolvemos el Producto actualizado con los datos del Elemento asociado.
    if (Object.keys(elementoData).length > 0) {
      await Elemento.update(elementoData, { where: { idElemento: id }, transaction: t });
    }
// Solo intentamos actualizar el Producto si hay datos para actualizar o si el Producto existe (para manejar el caso de querer eliminar la foto sin cambiar ningún otro dato). Si no se encuentra el Producto, updatedProducto será 0 y se devolverá un mensaje indicando que no se pudo actualizar.
    let updatedProducto = 0;
    if (Object.keys(productoData).length > 0) {
      const [num] = await Producto.update(productoData, { where: { idElemento: id }, transaction: t });
      updatedProducto = num;
    } else {
      const exists = await Producto.findByPk(id, { transaction: t });
      updatedProducto = exists ? 1 : 0;
    }

    await t.commit();
// Si updatedProducto es 0, significa que no se encontró el Producto para actualizar, por lo que devolvemos un mensaje indicando que no se pudo actualizar. Si se actualizó correctamente (updatedProducto es 1), devolvemos el Producto actualizado con los datos del Elemento asociado.
    if (updatedProducto !== 1) {
      return res.send({ message: `No ha sido posible actualizar Producto idElemento=${id}.` });
    }

    const data = await Producto.findByPk(id, {
      include: [{ model: Elemento, as: "Elemento" }]
    });

    return res.send(data);
  } catch (err) {
    await t.rollback();
    return res.status(500).send({ message: "Error actualizando Producto id=" + req.params.id });
  }
};

// =======================
// BORRAR PRODUCTO
// =======================
// Para borrar un Producto, primero borramos el registro de Producto y luego el registro de Elemento asociado. Si no se encuentra el Producto, no se borra nada.
exports.delete = async (req, res) => {
  const t = await db.sequelize.transaction();
  // Al eliminar un Producto, primero intentamos eliminar el registro de Producto. Si se elimina correctamente (num === 1), entonces eliminamos el registro de Elemento asociado. Si no se encuentra el Producto para eliminar, no se borra nada y se devuelve un mensaje indicando que no se pudo eliminar. Finalmente, devolvemos un mensaje indicando si el Producto fue eliminado correctamente o si no se pudo eliminar.
  try {
    const id = req.params.id;

    const num = await Producto.destroy({ where: { idElemento: id }, transaction: t });
// Solo si se eliminó el Producto, intentamos eliminar el Elemento asociado. Esto asegura que no borremos el Elemento si el Producto no existe.
    if (num === 1) {
      await Elemento.destroy({ where: { idElemento: id }, transaction: t });
    }

    await t.commit();
// Si num es 1, significa que se eliminó el Producto correctamente (y el Elemento asociado). Si num es 0, significa que no se encontró el Producto para eliminar, por lo que devolvemos un mensaje indicando que no se pudo eliminar.
    if (num === 1) return res.send({ message: "Producto eliminado correctamente." });
    return res.send({ message: `No ha sido posible eliminar Producto idElemento=${id}.` });
  } catch (err) {
    await t.rollback();
    return res.status(500).send({ message: "Error eliminando Producto id=" + req.params.id });
  }
};
