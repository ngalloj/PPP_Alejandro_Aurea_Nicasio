const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Treatment = sequelize.define('Treatment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    historialId: { type: DataTypes.INTEGER, references: { model: 'historiales', key: 'id' } },
    citaId: { type: DataTypes.INTEGER, references: { model: 'citas', key: 'id' } },
    animalId: { type: DataTypes.INTEGER, references: { model: 'animals', key: 'id' }, allowNull: false },
    veterinarioId: { type: DataTypes.INTEGER, references: { model: 'employees', key: 'id' }, allowNull: false },
    tipo: { type: DataTypes.ENUM('medicacion', 'cirugia', 'terapia', 'rehabilitacion', 'hospitalizacion', 'otro'), allowNull: false },
    nombre: { type: DataTypes.STRING(200), allowNull: false },
    descripcion: { type: DataTypes.TEXT, allowNull: false },
    diagnostico: { type: DataTypes.TEXT },
    medicamentos: { type: DataTypes.JSON },
    instrucciones: { type: DataTypes.TEXT },
    fechaInicio: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    fechaFin: { type: DataTypes.DATE },
    duracionEstimada: { type: DataTypes.INTEGER },
    estado: { type: DataTypes.ENUM('planificado', 'en_curso', 'completado', 'suspendido', 'cancelado'), defaultValue: 'en_curso' },
    frecuencia: { type: DataTypes.STRING(100) },
    dosis: { type: DataTypes.STRING(100) },
    viaAdministracion: { type: DataTypes.ENUM('oral', 'topica', 'inyectable', 'intravenosa', 'otro') },
    efectosSecundarios: { type: DataTypes.TEXT },
    resultados: { type: DataTypes.TEXT },
    seguimientos: { type: DataTypes.JSON },
    costo: { type: DataTypes.DECIMAL(10, 2) },
    notas: { type: DataTypes.TEXT }
  }, { tableName: 'treatments', timestamps: true });

  Treatment.associate = (models) => {
    Treatment.belongsTo(models.Animal, { foreignKey: 'animalId', as: 'animal' });
    if (models.Employee) Treatment.belongsTo(models.Employee, { foreignKey: 'veterinarioId', as: 'veterinario' });
    if (models.Historial) Treatment.belongsTo(models.Historial, { foreignKey: 'historialId', as: 'historial' });
    if (models.Cita) Treatment.belongsTo(models.Cita, { foreignKey: 'citaId', as: 'cita' });
  };
  
  return Treatment;
};
