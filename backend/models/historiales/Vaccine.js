const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Vaccine = sequelize.define('Vaccine', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    animalId: { type: DataTypes.INTEGER, references: { model: 'animals', key: 'id' }, allowNull: false },
    historialId: { type: DataTypes.INTEGER, references: { model: 'historiales', key: 'id' } },
    veterinarioId: { type: DataTypes.INTEGER, references: { model: 'employees', key: 'id' }, allowNull: false },
    nombreVacuna: { type: DataTypes.STRING(200), allowNull: false },
    tipoVacuna: { type: DataTypes.ENUM('rabia', 'polivalente', 'moquillo', 'parvovirus', 'hepatitis', 'leptospirosis', 'leishmaniasis', 'tos_perrera', 'triple_felina', 'leucemia_felina', 'otro'), allowNull: false },
    fabricante: { type: DataTypes.STRING(150) },
    lote: { type: DataTypes.STRING(100) },
    fechaAplicacion: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    fechaProximaDosis: { type: DataTypes.DATE },
    dosis: { type: DataTypes.STRING(50) },
    viaAdministracion: { type: DataTypes.ENUM('subcutanea', 'intramuscular', 'oral', 'intranasal'), defaultValue: 'subcutanea' },
    pesoAnimal: { type: DataTypes.DECIMAL(5, 2) },
    numeroRefuerzo: { type: DataTypes.INTEGER, defaultValue: 1 },
    efectosAdversos: { type: DataTypes.TEXT },
    certificadoEmitido: { type: DataTypes.BOOLEAN, defaultValue: false },
    numeroCertificado: { type: DataTypes.STRING(100), unique: true },
    obligatoria: { type: DataTypes.BOOLEAN, defaultValue: false },
    costo: { type: DataTypes.DECIMAL(8, 2) },
    estado: { type: DataTypes.ENUM('aplicada', 'programada', 'cancelada', 'vencida'), defaultValue: 'aplicada' },
    recordatorioCreado: { type: DataTypes.BOOLEAN, defaultValue: false },
    notas: { type: DataTypes.TEXT }
  }, { tableName: 'vaccines', timestamps: true });

  Vaccine.associate = (models) => {
    Vaccine.belongsTo(models.Animal, { foreignKey: 'animalId', as: 'animal' });
    if (models.Employee) Vaccine.belongsTo(models.Employee, { foreignKey: 'veterinarioId', as: 'veterinario' });
    if (models.Historial) Vaccine.belongsTo(models.Historial, { foreignKey: 'historialId', as: 'historial' });
  };
  
  return Vaccine;
};
