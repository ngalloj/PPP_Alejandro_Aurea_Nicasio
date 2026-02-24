const db = require("../../models");
const Elemento = db.Elemento;
const Producto = db.Producto;

const path = require("path");
const fs = require("fs/promises");

// ===== utilidades mínimas para borrar imagen =====

function safeImagePath(filename) {
  if (!filename) return null;
  const base = path.basename(filename);
  return path.join(process.cwd(), "public", "images", base);
}

async function deleteImageIfExists(filename) {
  if (!filename) return;
  const filePath = safeImagePath(filename);
  try {
    await fs.unlink(filePath);
  } catch (err) {
    if (err.code !== "ENOENT") {
      console.warn("No se pudo borrar imagen:", filePath, err.message);
    }
  }
}

function pickDefined(obj) {
  const out = {};
  Object.keys(obj).forEach((k) => {
    if (obj[k] !== undefined) out[k] = obj[k];
  });
  return out;
}

// ================= CREATE =================

exports.create = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    if (!req.body.nombre || req.body.precio === undefined || !req.body.tipo ||
        req.body.stock === undefined || req.body.stockMinimo === undefined) {
      await t.rollback();
      return res.status(400).send({
        message: "nombre, precio, stock, stockMinimo y tipo son obligatorios."
      });
    }

    let fotoNombre;

    if (req.file) {
      fotoNombre = req.file.filename;
    }

    const elemento = await Elemento.create({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      precio: req.body.precio
    }, { transaction: t });

    const producto = await Producto.create({
      idElemento: elemento.idElemento,
      stock: req.body.stock,
      stockMinimo: req.body.stockMinimo,
      tipo: req.body.tipo,
      foto: fotoNombre
    }, { transaction: t });

    await t.commit();

    const data = await Producto.findByPk(producto.idElemento, {
      include: [{ model: Elemento, as: "Elemento" }]
    });

    return res.send(data);
  } catch (err) {
    await t.rollback();

    // limpiar imagen subida si falla
    if (req.file?.filename) {
      await deleteImageIfExists(req.file.filename);
    }

    return res.status(500).send({ message: err.message || "Error creando Producto." });
  }
};

// ================= FIND =================

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

// ================= UPDATE =================

exports.update = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const id = req.params.id;

    // 1️⃣ Obtener producto actual para saber imagen anterior
    const actual = await Producto.findByPk(id, { transaction: t });
    if (!actual) {
      await t.rollback();
      return res.status(404).send({ message: `Producto no encontrado idElemento=${id}` });
    }

    const oldFoto = actual.foto;

    let fotoNombre; // undefined por defecto (no tocar foto)

    if (req.file) {
      fotoNombre = req.file.filename;
    }

    const removeImage =
      req.body.removeImage === true ||
      req.body.removeImage === 'true' ||
      req.body.removeImage === '1' ||
      req.body.removeImage === 1;

    if (removeImage) {
      fotoNombre = null;
    }

    const elementoData = pickDefined({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      precio: req.body.precio
    });

    const productoData = pickDefined({
      stock: req.body.stock,
      stockMinimo: req.body.stockMinimo,
      tipo: req.body.tipo,
      foto: fotoNombre
    });

    if (Object.keys(elementoData).length > 0) {
      await Elemento.update(elementoData, { where: { idElemento: id }, transaction: t });
    }

    if (Object.keys(productoData).length > 0) {
      await Producto.update(productoData, { where: { idElemento: id }, transaction: t });
    }

    await t.commit();

    // 2️⃣ Borrar imagen antigua si:
    // - removeImage
    // - o se subió una nueva
    if ((removeImage || req.file) && oldFoto) {
      if (!req.file || oldFoto !== req.file.filename) {
        await deleteImageIfExists(oldFoto);
      }
    }

    const data = await Producto.findByPk(id, {
      include: [{ model: Elemento, as: "Elemento" }]
    });

    return res.send(data);

  } catch (err) {
    await t.rollback();

    // limpiar nueva imagen si falla el update
    if (req.file?.filename) {
      await deleteImageIfExists(req.file.filename);
    }

    return res.status(500).send({ message: "Error actualizando Producto id=" + req.params.id });
  }
};

// ================= DELETE =================

exports.delete = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const id = req.params.id;

    // Obtener imagen antes de borrar
    const producto = await Producto.findByPk(id, { transaction: t });
    if (!producto) {
      await t.rollback();
      return res.status(404).send({ message: `Producto no encontrado idElemento=${id}` });
    }

    const oldFoto = producto.foto;

    const num = await Producto.destroy({ where: { idElemento: id }, transaction: t });

    if (num === 1) {
      await Elemento.destroy({ where: { idElemento: id }, transaction: t });
    }

    await t.commit();

    // Borrar imagen física tras commit
    if (num === 1 && oldFoto) {
      await deleteImageIfExists(oldFoto);
    }

    if (num === 1) return res.send({ message: "Producto eliminado correctamente." });
    return res.send({ message: `No ha sido posible eliminar Producto idElemento=${id}.` });

  } catch (err) {
    await t.rollback();
    return res.status(500).send({ message: "Error eliminando Producto id=" + req.params.id });
  }
};
