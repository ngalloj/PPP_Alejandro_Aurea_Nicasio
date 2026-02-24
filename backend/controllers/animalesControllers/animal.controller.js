// Controlador para la entidad Animal
const db = require("../../models");
// Se importa el modelo Animal
const Animal = db.Animal;
// Se importa Cloudinary para gestionar las imágenes
const cloudinary = require('cloudinary').v2;

// =======================
// CREAR ANIMAL
// =======================
// La función create ahora maneja la subida de imagen a Cloudinary y guarda la URL en la base de datos.
exports.create = async (req, res) => {
  try {
    if (!req.body.nombre || !req.body.idUsuario) {
      return res.status(400).send({ message: "nombre e idUsuario son obligatorios." });
    }

    // Inicialmente, la URL de la foto es null (sin imagen)
    let fotoUrl = null;

    // Si viene fichero, súbelo a Cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'clinica/animales',
      });
      fotoUrl = result.secure_url;
    }
// Luego creamos el Animal con los datos del body y la URL de la foto (si existe)
    const data = await Animal.create({
      ...req.body,
      foto: fotoUrl, // puede ser null si no hay imagen
    });
// Finalmente, devolvemos el nuevo Animal creado.
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error creando Animal." });
  }
};

// =======================
// LISTAR / OBTENER
// =======================
// La función findAll devuelve todos los animales, y findOne devuelve un animal por su id.
exports.findAll = async (req, res) => {
  // La función findAll obtiene todos los registros de la tabla Animal y los devuelve. Si ocurre un error, devuelve un error 500.
  try {
    const data = await Animal.findAll();
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error listando Animales." });
  }
};
// Al buscar un Animal por id, devolvemos el animal encontrado o un error 404 si no existe.
exports.findOne = async (req, res) => {
  // La función findOne busca un Animal por su id (idAnimal) y devuelve el resultado. Si no se encuentra, devuelve un error 404.
  try {
    const id = req.params.id;
    const data = await Animal.findByPk(id);
    if (!data) return res.status(404).send({ message: `Animal no encontrado id=${id}` });
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error obteniendo Animal." });
  }
};

// =======================
// ACTUALIZAR ANIMAL
// =======================
// La función update ahora maneja la lógica de actualización de la imagen: si se indica que se quiere eliminar la imagen, se borra; si se sube una nueva imagen, se actualiza la URL; si no se toca el campo de imagen, no se modifica.
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
// Para interpretar correctamente la intención de eliminar la imagen, comprobamos si el campo removeImage en el body es true (en varias formas). Esto permite que el cliente indique que quiere eliminar la imagen sin necesidad de subir una nueva.
    const removeImage =
      req.body.removeImage === true ||
      req.body.removeImage === 'true' ||
      req.body.removeImage === '1' ||
      req.body.removeImage === 1;
// La variable removeImage se interpreta como true si el valor es booleano true, o la cadena 'true', o '1', o el número 1. Esto permite flexibilidad en cómo se indica que se quiere eliminar la imagen.
    let nuevaFoto; // undefined = no tocar, null = borrar, string = nueva URL
// Si removeImage es true, establecemos nuevaFoto a null para indicar que se debe eliminar la imagen. Si se sube un nuevo archivo, lo subimos a Cloudinary y guardamos la nueva URL. Si ninguna de las dos cosas ocurre, dejamos nuevaFoto como undefined para no modificar el campo de la foto.
    if (removeImage) {
      nuevaFoto = null;
    } else if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'clinica/animales',
      });
      nuevaFoto = result.secure_url;
    }
// Luego, preparamos los datos a actualizar. Copiamos todo lo que viene en req.body, pero eliminamos el campo 'foto' para evitar sobreescribirlo accidentalmente. Si nuevaFoto no es undefined, lo añadimos al objeto de actualización.
    const updateData = { ...req.body };

    // No queremos sobreescribir con el nombre de fichero local
    delete updateData.foto;
// Si nuevaFoto es null, se eliminará la imagen; si es una URL, se actualizará; si es undefined, no se tocará el campo de la foto.
    if (nuevaFoto !== undefined) {
      updateData.foto = nuevaFoto;
    }

    const [num] = await Animal.update(updateData, { where: { idAnimal: id } });
// El método update devuelve un array donde el primer elemento es el número de filas afectadas. Si num es 1, significa que se actualizó un registro correctamente. Si num es 0, significa que no se encontró el Animal con ese id o no se modificó ningún campo (por ejemplo, si los datos enviados son iguales a los existentes).
    if (num === 1) {
      return res.send({ message: "Animal actualizado correctamente." });
    }
    return res.send({ message: `No ha sido posible actualizar Animal id=${id}.` });
  } catch (err) {
    return res.status(500).send({ message: "Error actualizando Animal id=" + req.params.id });
  }
};

// =======================
// BORRAR ANIMAL
// =======================
// La función delete elimina un animal por su id y devuelve un mensaje indicando si la eliminación fue exitosa o no.
exports.delete = async (req, res) => {
  // La función delete elimina un Animal por su id (idAnimal) y devuelve un mensaje indicando si la eliminación fue exitosa o no. Si ocurre un error, devuelve un error 500.
  try {
    const id = req.params.id;
    const num = await Animal.destroy({ where: { idAnimal: id } });
    if (num === 1) return res.send({ message: "Animal eliminado correctamente." });
    return res.send({ message: `No ha sido posible eliminar Animal id=${id}.` });
  } catch (err) {
    return res.status(500).send({ message: "Error eliminando Animal id=" + req.params.id });
  }
};
