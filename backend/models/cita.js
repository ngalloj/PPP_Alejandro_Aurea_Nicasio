// backend/models/cita.js
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Cita = sequelize.define('Cita', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    fecha: { type: DataTypes.DATE, allowNull: false },
    motivo: DataTypes.STRING,
    usuario_dni: { // CAMBIO: de usuario_id a usuario_dni
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'dni'
      }
    },
    animal_id: { // FK opcional para animal
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'animales',
        key: 'id'
      }
    }
  }, {
    timestamps: false,
    tableName: 'citas'
  });

  Cita.associate = (models) => {
    Cita.belongsTo(models.Usuario, { foreignKey: 'usuario_dni', targetKey: 'dni' });
    Cita.belongsTo(models.Animal, { foreignKey: 'animal_id' });
  };

  return Cita;
};
