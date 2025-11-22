// backend/migrations/20251121230705-update-animales-table.js

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Cambiar usuario_id por usuario_dni
    await queryInterface.removeColumn('animales', 'usuario_id');
    await queryInterface.addColumn('animales', 'usuario_dni', {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'dni'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    // Añadir nuevos campos
    await queryInterface.addColumn('animales', 'motivo_atencion', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('animales', 'fecha_atencion', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('animales', 'foto_url', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('animales', 'usuario_dni');
    await queryInterface.removeColumn('animales', 'motivo_atencion');
    await queryInterface.removeColumn('animales', 'fecha_atencion');
    await queryInterface.removeColumn('animales', 'foto_url');
    
    await queryInterface.addColumn('animales', 'usuario_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    });
  }
};
