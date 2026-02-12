// backend/models/animal.js
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Animal = sequelize.define('Animal', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING, allowNull: false },
    especie: DataTypes.STRING,
    edad: DataTypes.INTEGER,
    peso: DataTypes.DECIMAL(5,2),
    usuario_dni: { // CAMBIO: de usuario_id a usuario_dni
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'dni'
      }
    },
    motivo_atencion: { type: DataTypes.TEXT, allowNull: true }, // NUEVO
    fecha_atencion: { type: DataTypes.DATE, allowNull: true },  // NUEVO
    foto_url: { type: DataTypes.STRING, allowNull: true }       // NUEVO
  }, {
    timestamps: false,
    tableName: 'animales'
  });

  Animal.associate = (models) => {
    Animal.belongsTo(models.Usuario, { foreignKey: 'usuario_dni', targetKey: 'dni' });
    Animal.hasOne(models.Historial, {foreignKey: 'idAnimal', as: 'Historial'});
    Animal.hasMany(models.Cita, { foreignKey: 'idAnimal', as: 'Citas' });
  };

  return Animal;
};
