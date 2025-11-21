// backend/models/cita.js
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Cita = sequelize.define('Cita', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    fecha: { type: DataTypes.DATE, allowNull: false },
    motivo: DataTypes.STRING,
    usuario_id: { // FK para usuario
      type: DataTypes.INTEGER,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    }
    // Puedes añadir también animal_id si la cita va ligada a un animal.
  }, {
    timestamps: false,
    tableName: 'citas' // Nuevo nombre real de la tabla
  });

  Cita.associate = (models) => {
    Cita.belongsTo(models.Usuario, { foreignKey: 'usuario_id' });
    // Si añades animal_id:
    // Cita.belongsTo(models.Animal, { foreignKey: 'animal_id' });
  };

  return Cita;
};
