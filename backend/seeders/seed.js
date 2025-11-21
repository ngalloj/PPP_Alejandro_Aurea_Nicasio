// backend/seeders/seed.js
const { sequelize, Animal, Usuario, Cita } = require('../models');

async function seed() {
  await sequelize.sync({ force: true });
  const usuario = await Usuario.create({ email: 'seed@mail.com', password: '1234' });
  const animal = await Animal.create({ nombre: 'Coco', especie: 'Gato', edad: 2, peso: 4.6 });
  await Cita.create({ fecha: new Date(), motivo: 'Chequeo', animal_id: animal.id, usuario_id: usuario.id });
  console.log("Datos de ejemplo insertados.");
  process.exit();
}
seed();
