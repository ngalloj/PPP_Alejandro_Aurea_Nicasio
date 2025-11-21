const { sequelize, Animal, Usuario, Cita } = require('./models');

async function testDB() {
  await sequelize.sync({ alter: true }); // Asegura estructura
  // CREA UN USUARIO
  const bcrypt = require('bcrypt');
const pwHash = bcrypt.hashSync('1234', 10);

const usuario = await Usuario.create({
  email: 'prueba@correo.com',
  password: pwHash
});


  // CREA UN ANIMAL
  const animal = await Animal.create({
    nombre: 'Milo',
    especie: 'Perro',
    edad: 2,
    peso: 13.5
  });

  // CREA UNA CITA
  const cita = await Cita.create({
    fecha: new Date(),
    motivo: 'Vacunación',
    animal_id: animal.id,
    usuario_id: usuario.id
  });

  // CONSULTA
  const citas = await Cita.findAll({ include: [Animal, Usuario] });
  console.log(JSON.stringify(citas, null, 2));
}

testDB().then(() => {
  console.log("Test de CRUD completado y backend conectado a la base de datos.");
  process.exit();
}).catch(err => {
  console.error("Error en test CRUD:", err);
  process.exit(1);
});
