// animales.controller.js  (cambios mínimos: borrar fichero en public/images al eliminar o reemplazar foto)

const db = require("../../models");
const Animal = db.Animal;

const path = require("path");
const fs = require("fs/promises");

// ===== utilidades mínimas para borrar imagen =====
function safeImagePath(filename) {
  if (!filename) return null;
  const base = path.basename(filename); // evita rutas raras
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

exports.create = async (req, res) => {
  try {
    if (!req.body.nombre || !req.body.idUsuario) {
      return res.status(400).send({ message: "nombre e idUsuario son obligatorios." });
    }

    if (req.file) {
      req.body.foto = req.file.filename;
    } else {
      req.body.foto = "";
    }

    const data = await Animal.create(req.body);
    return res.send(data);
  } catch (err) {
    // limpiar imagen subida si falla create
    if (req.file?.filename) {
      await deleteImageIfExists(req.file.filename);
    }
    return res.status(500).send({ message: err.message || "Error creando Animal." });
  }
};

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

exports.update = async (req, res) => {
  try {
    const id = req.params.id;

    // 1) Leer foto anterior para poder borrarla si procede
    const actual = await Animal.findByPk(id);
    if (!actual) return res.status(404).send({ message: `Animal no encontrado id=${id}` });
    const oldFoto = actual.foto;

    const removeImage =
      req.body.removeImage === true ||
      req.body.removeImage === "true" ||
      req.body.removeImage === "1" ||
      req.body.removeImage === 1;

    // 2) Setear nueva foto / borrar referencia
    if (req.file) {
      req.body.foto = req.file.filename;
    }
    if (removeImage) {
      req.body.foto = null;
    }

    const [num] = await Animal.update(req.body, { where: { idAnimal: id } });

    if (num !== 1) {
      // si no se actualizó, elimina posible fichero nuevo para no dejarlo huérfano
      if (req.file?.filename) await deleteImageIfExists(req.file.filename);
      return res.send({ message: `No ha sido posible actualizar Animal id=${id}.` });
    }

    // 3) Borrar fichero viejo si:
    // - se pidió removeImage
    // - o se subió una nueva imagen
    if ((removeImage || req.file) && oldFoto) {
      // evita borrar si por error coincide con la nueva
      if (!req.file || oldFoto !== req.file.filename) {
        await deleteImageIfExists(oldFoto);
      }
    }

    return res.send({ message: "Animal actualizado correctamente." });
  } catch (err) {
    // si falló el update y subieron fichero, lo limpiamos
    if (req.file?.filename) {
      await deleteImageIfExists(req.file.filename);
    }
    return res.status(500).send({ message: "Error actualizando Animal id=" + req.params.id });
  }
};

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    // 1) leer foto antes de borrar
    const actual = await Animal.findByPk(id);
    if (!actual) return res.status(404).send({ message: `Animal no encontrado id=${id}` });
    const oldFoto = actual.foto;

    // 2) borrar registro
    const num = await Animal.destroy({ where: { idAnimal: id } });

    // 3) borrar fichero si se borró el registro
    if (num === 1) {
      if (oldFoto) await deleteImageIfExists(oldFoto);
      return res.send({ message: "Animal eliminado correctamente." });
    }

    return res.send({ message: `No ha sido posible eliminar Animal id=${id}.` });
  } catch (err) {
    return res.status(500).send({ message: "Error eliminando Animal id=" + req.params.id });
  }
};