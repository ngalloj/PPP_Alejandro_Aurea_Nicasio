const db = require("../../models");
const Animal = db.Animal;
const cloudinary = require('cloudinary').v2;

// =======================
// CREAR ANIMAL
// =======================
exports.create = async (req, res) => {
  try {
    if (!req.body.nombre || !req.body.idUsuario) {
      return res.status(400).send({ message: "nombre e idUsuario son obligatorios." });
    }

    let fotoUrl = null;

    // Si viene fichero, súbelo a Cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'clinica/animales',
      });
      fotoUrl = result.secure_url;
    }

    const data = await Animal.create({
      ...req.body,
      foto: fotoUrl, // puede ser null si no hay imagen
    });

    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error creando Animal." });
  }
};

// =======================
// LISTAR / OBTENER
// =======================
exports.findAll = async (req, res) => {
  try {
    const data = await Animal.findAll();
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error listando Animales." });
  }
};

exports.findOne = async (req, res) => {
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
exports.update = async (req, res) => {
  try {
    const id = req.params.id;

    const removeImage =
      req.body.removeImage === true ||
      req.body.removeImage === 'true' ||
      req.body.removeImage === '1' ||
      req.body.removeImage === 1;

    let nuevaFoto; // undefined = no tocar, null = borrar, string = nueva URL

    if (removeImage) {
      nuevaFoto = null;
    } else if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'clinica/animales',
      });
      nuevaFoto = result.secure_url;
    }

    const updateData = { ...req.body };

    // No queremos sobreescribir con el nombre de fichero local
    delete updateData.foto;

    if (nuevaFoto !== undefined) {
      updateData.foto = nuevaFoto;
    }

    const [num] = await Animal.update(updateData, { where: { idAnimal: id } });

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
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const num = await Animal.destroy({ where: { idAnimal: id } });
    if (num === 1) return res.send({ message: "Animal eliminado correctamente." });
    return res.send({ message: `No ha sido posible eliminar Animal id=${id}.` });
  } catch (err) {
    return res.status(500).send({ message: "Error eliminando Animal id=" + req.params.id });
  }
};
