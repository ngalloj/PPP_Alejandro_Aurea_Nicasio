// backend/seeders/create-test-users.js
const { sequelize, Usuario } = require('../models');
const bcrypt = require('bcrypt');

async function createTestUsers() {
  try {
    await sequelize.sync();

    // ✅ ELIMINAR usuarios existentes primero
    await Usuario.destroy({
      where: {
        email: ['admin@test.com', 'vet@test.com', 'recep@test.com', 'cliente@test.com']
      }
    });
    console.log('🗑️  Usuarios antiguos eliminados');

    // Admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await Usuario.create({
      email: 'admin@test.com',
      password: adminPassword,
      rol: 'admin',
      dni: '11111111A'
    });
    console.log('✅ Usuario admin creado:', admin.email, '/ admin123');

    // Veterinario
    const vetPassword = await bcrypt.hash('vet123', 10);
    const vet = await Usuario.create({
      email: 'vet@test.com',
      password: vetPassword,
      rol: 'veterinario',
      dni: '22222222B'
    });
    console.log('✅ Usuario veterinario creado:', vet.email, '/ vet123');

    // Recepcionista
    const recepPassword = await bcrypt.hash('recep123', 10);
    const recep = await Usuario.create({
      email: 'recep@test.com',
      password: recepPassword,
      rol: 'recepcionista',
      dni: '33333333C'
    });
    console.log('✅ Usuario recepcionista creado:', recep.email, '/ recep123');

    // Cliente
    const clientePassword = await bcrypt.hash('cliente123', 10);
    const cliente = await Usuario.create({
      email: 'cliente@test.com',
      password: clientePassword,
      rol: 'cliente',
      dni: '44444444D'
    });
    console.log('✅ Usuario cliente creado:', cliente.email, '/ cliente123');

    console.log('\n✅ Todos los usuarios de prueba han sido creados');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createTestUsers();
