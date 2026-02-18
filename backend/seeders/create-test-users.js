// backend/seeders/create-test-users.js
const { sequelize, Usuario } = require('../models');
const bcrypt = require('bcrypt');

async function createTestUsers() {
  try {
    await sequelize.sync();

    // Admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    await Usuario.findOrCreate({
      where: { email: 'admin@test.com' },
      defaults: {
        email: 'admin@test.com',
        password: adminPassword,
        rol: 'admin',
        dni: '11111111A'
      }
    });
    console.log('✅ Usuario admin creado: admin@test.com / admin123');

    // Veterinario
    const vetPassword = await bcrypt.hash('vet123', 10);
    await Usuario.findOrCreate({
      where: { email: 'vet@test.com' },
      defaults: {
        email: 'vet@test.com',
        password: vetPassword,
        rol: 'veterinario',
        dni: '22222222B'
      }
    });
    console.log('✅ Usuario veterinario creado: vet@test.com / vet123');

    // Recepcionista
    const recepPassword = await bcrypt.hash('recep123', 10);
    await Usuario.findOrCreate({
      where: { email: 'recep@test.com' },
      defaults: {
        email: 'recep@test.com',
        password: recepPassword,
        rol: 'recepcionista',
        dni: '33333333C'
      }
    });
    console.log('✅ Usuario recepcionista creado: recep@test.com / recep123');

    // Cliente
    const clientePassword = await bcrypt.hash('cliente123', 10);
    await Usuario.findOrCreate({
      where: { email: 'cliente@test.com' },
      defaults: {
        email: 'cliente@test.com',
        password: clientePassword,
        rol: 'cliente',
        dni: '44444444D'
      }
    });
    console.log('✅ Usuario cliente creado: cliente@test.com / cliente123');

    console.log('\n✅ Todos los usuarios de prueba han sido creados');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createTestUsers();
