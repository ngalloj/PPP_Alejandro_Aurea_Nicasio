// backend/models/animal.js
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Animal = sequelize.define('Animal', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING, allowNull: false },
    especie: DataTypes.STRING,
    edad: DataTypes.INTEGER,
    peso: DataTypes.DECIMAL(5,2),
    usuario_id: { // FK para usuario
      type: DataTypes.INTEGER,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    }
  }, {
    timestamps: false,
    tableName: 'animales' // Nuevo nombre real de la tabla
  });

  Animal.associate = (models) => {
    Animal.belongsTo(models.Usuario, { foreignKey: 'usuario_id' });
  };

  return Animal;
};
