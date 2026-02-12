/// backend/seeders/seedUsers.js - CORREGIDO

const bcrypt = require('bcryptjs');
const { Usuario, sequelize } = require('../models');

const seedUsers = async () => {
  try {
    // Contraseña: admin123
    const hashedPassword = await bcrypt.hash('admin123', 10);

    await Usuario.create({
      email: 'admin@test.com',
      password: hashedPassword,
      rol: 'admin',
      dni: '12345678A',  // ✅ AGREGAR DNI
      nombre: 'Admin'    // Si lo necesita
    });

    console.log('✅ Usuario admin@test.com creado con éxito');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

seedUsers();
