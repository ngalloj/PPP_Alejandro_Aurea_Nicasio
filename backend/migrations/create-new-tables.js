'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('employees', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      usuarioId: { type: Sequelize.INTEGER, allowNull: false },
      nombre: { type: Sequelize.STRING(100), allowNull: false },
      apellidos: { type: Sequelize.STRING(150), allowNull: false },
      dni: { type: Sequelize.STRING(20), unique: true, allowNull: false },
      email: { type: Sequelize.STRING(150), unique: true, allowNull: false },
      telefono: { type: Sequelize.STRING(20) },
      direccion: { type: Sequelize.TEXT },
      puesto: { type: Sequelize.ENUM('veterinario', 'recepcionista', 'auxiliar', 'administrador', 'peluquero'), allowNull: false, defaultValue: 'auxiliar' },
      numeroColegiadoVeterinario: { type: Sequelize.STRING(50) },
      especialidad: { type: Sequelize.STRING(100) },
      fechaContratacion: { type: Sequelize.DATE, allowNull: false },
      salario: { type: Sequelize.DECIMAL(10, 2) },
      horaInicio: { type: Sequelize.TIME },
      horaFin: { type: Sequelize.TIME },
      diasTrabajo: { type: Sequelize.JSON },
      estado: { type: Sequelize.ENUM('activo', 'inactivo', 'vacaciones', 'baja_temporal'), defaultValue: 'activo' },
      fotoPerfil: { type: Sequelize.STRING(255) },
      notas: { type: Sequelize.TEXT },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable('notifications', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      usuarioId: { type: Sequelize.INTEGER, allowNull: false },
      tipo: { type: Sequelize.ENUM('cita_proxima', 'cita_confirmada', 'cita_cancelada', 'recordatorio_vacuna', 'resultado_analisis', 'factura_pendiente', 'mensaje_veterinario', 'stock_bajo', 'sistema'), allowNull: false },
      titulo: { type: Sequelize.STRING(200), allowNull: false },
      mensaje: { type: Sequelize.TEXT, allowNull: false },
      leida: { type: Sequelize.BOOLEAN, defaultValue: false },
      fechaLectura: { type: Sequelize.DATE },
      prioridad: { type: Sequelize.ENUM('baja', 'media', 'alta', 'urgente'), defaultValue: 'media' },
      enlace: { type: Sequelize.STRING(255) },
      metadatos: { type: Sequelize.JSON },
      canalEnvio: { type: Sequelize.JSON },
      enviadaEmail: { type: Sequelize.BOOLEAN, defaultValue: false },
      enviadaSms: { type: Sequelize.BOOLEAN, defaultValue: false },
      fechaEnvio: { type: Sequelize.DATE },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable('reminders', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      animalId: { type: Sequelize.INTEGER, allowNull: false },
      usuarioId: { type: Sequelize.INTEGER, allowNull: false },
      tipo: { type: Sequelize.ENUM('vacuna', 'desparasitacion', 'revision', 'medicacion', 'cirugia_control', 'analisis', 'otro'), allowNull: false },
      titulo: { type: Sequelize.STRING(200), allowNull: false },
      descripcion: { type: Sequelize.TEXT },
      fechaRecordatorio: { type: Sequelize.DATE, allowNull: false },
      fechaVencimiento: { type: Sequelize.DATE },
      estado: { type: Sequelize.ENUM('pendiente', 'enviado', 'completado', 'vencido', 'cancelado'), defaultValue: 'pendiente' },
      prioridad: { type: Sequelize.ENUM('baja', 'media', 'alta', 'urgente'), defaultValue: 'media' },
      enviado: { type: Sequelize.BOOLEAN, defaultValue: false },
      fechaEnvio: { type: Sequelize.DATE },
      completado: { type: Sequelize.BOOLEAN, defaultValue: false },
      fechaCompletado: { type: Sequelize.DATE },
      notasCompletado: { type: Sequelize.TEXT },
      repetir: { type: Sequelize.BOOLEAN, defaultValue: false },
      frecuencia: { type: Sequelize.ENUM('semanal', 'mensual', 'trimestral', 'semestral', 'anual') },
      metadatos: { type: Sequelize.JSON },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable('treatments', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      historialId: { type: Sequelize.INTEGER },
      citaId: { type: Sequelize.INTEGER },
      animalId: { type: Sequelize.INTEGER, allowNull: false },
      veterinarioId: { type: Sequelize.INTEGER, allowNull: false },
      tipo: { type: Sequelize.ENUM('medicacion', 'cirugia', 'terapia', 'rehabilitacion', 'hospitalizacion', 'otro'), allowNull: false },
      nombre: { type: Sequelize.STRING(200), allowNull: false },
      descripcion: { type: Sequelize.TEXT, allowNull: false },
      diagnostico: { type: Sequelize.TEXT },
      medicamentos: { type: Sequelize.JSON },
      instrucciones: { type: Sequelize.TEXT },
      fechaInicio: { type: Sequelize.DATE, allowNull: false },
      fechaFin: { type: Sequelize.DATE },
      duracionEstimada: { type: Sequelize.INTEGER },
      estado: { type: Sequelize.ENUM('planificado', 'en_curso', 'completado', 'suspendido', 'cancelado'), defaultValue: 'en_curso' },
      frecuencia: { type: Sequelize.STRING(100) },
      dosis: { type: Sequelize.STRING(100) },
      viaAdministracion: { type: Sequelize.ENUM('oral', 'topica', 'inyectable', 'intravenosa', 'otro') },
      efectosSecundarios: { type: Sequelize.TEXT },
      resultados: { type: Sequelize.TEXT },
      seguimientos: { type: Sequelize.JSON },
      costo: { type: Sequelize.DECIMAL(10, 2) },
      notas: { type: Sequelize.TEXT },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable('suppliers', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      nombre: { type: Sequelize.STRING(200), allowNull: false },
      nombreComercial: { type: Sequelize.STRING(200) },
      cif: { type: Sequelize.STRING(20), unique: true, allowNull: false },
      direccion: { type: Sequelize.TEXT },
      ciudad: { type: Sequelize.STRING(100) },
      provincia: { type: Sequelize.STRING(100) },
      codigoPostal: { type: Sequelize.STRING(10) },
      pais: { type: Sequelize.STRING(100), defaultValue: 'España' },
      telefono: { type: Sequelize.STRING(20) },
      telefonoAlternativo: { type: Sequelize.STRING(20) },
      email: { type: Sequelize.STRING(150) },
      web: { type: Sequelize.STRING(255) },
      personaContacto: { type: Sequelize.STRING(150) },
      telefonoContacto: { type: Sequelize.STRING(20) },
      emailContacto: { type: Sequelize.STRING(150) },
      tipoProveedor: { type: Sequelize.ENUM('medicamentos', 'alimentos', 'material_quirurgico', 'equipamiento', 'limpieza', 'general', 'otro'), defaultValue: 'general' },
      condicionesPago: { type: Sequelize.STRING(100) },
      descuentoGeneral: { type: Sequelize.DECIMAL(5, 2), defaultValue: 0 },
      iban: { type: Sequelize.STRING(34) },
      estado: { type: Sequelize.ENUM('activo', 'inactivo', 'bloqueado'), defaultValue: 'activo' },
      calificacion: { type: Sequelize.INTEGER },
      notas: { type: Sequelize.TEXT },
      ultimaCompra: { type: Sequelize.DATE },
      totalComprado: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable('vaccines', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      animalId: { type: Sequelize.INTEGER, allowNull: false },
      historialId: { type: Sequelize.INTEGER },
      veterinarioId: { type: Sequelize.INTEGER, allowNull: false },
      nombreVacuna: { type: Sequelize.STRING(200), allowNull: false },
      tipoVacuna: { type: Sequelize.ENUM('rabia', 'polivalente', 'moquillo', 'parvovirus', 'hepatitis', 'leptospirosis', 'leishmaniasis', 'tos_perrera', 'triple_felina', 'leucemia_felina', 'otro'), allowNull: false },
      fabricante: { type: Sequelize.STRING(150) },
      lote: { type: Sequelize.STRING(100) },
      fechaAplicacion: { type: Sequelize.DATE, allowNull: false },
      fechaProximaDosis: { type: Sequelize.DATE },
      dosis: { type: Sequelize.STRING(50) },
      viaAdministracion: { type: Sequelize.ENUM('subcutanea', 'intramuscular', 'oral', 'intranasal'), defaultValue: 'subcutanea' },
      pesoAnimal: { type: Sequelize.DECIMAL(5, 2) },
      numeroRefuerzo: { type: Sequelize.INTEGER, defaultValue: 1 },
      efectosAdversos: { type: Sequelize.TEXT },
      certificadoEmitido: { type: Sequelize.BOOLEAN, defaultValue: false },
      numeroCertificado: { type: Sequelize.STRING(100) },
      obligatoria: { type: Sequelize.BOOLEAN, defaultValue: false },
      costo: { type: Sequelize.DECIMAL(8, 2) },
      estado: { type: Sequelize.ENUM('aplicada', 'programada', 'cancelada', 'vencida'), defaultValue: 'aplicada' },
      recordatorioCreado: { type: Sequelize.BOOLEAN, defaultValue: false },
      notas: { type: Sequelize.TEXT },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable('payment_methods', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      facturaId: { type: Sequelize.INTEGER, allowNull: false },
      metodoPago: { type: Sequelize.ENUM('efectivo', 'tarjeta_credito', 'tarjeta_debito', 'transferencia', 'bizum', 'paypal', 'aplazado', 'seguro', 'otro'), allowNull: false },
      cantidad: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      referenciaPago: { type: Sequelize.STRING(100) },
      fechaPago: { type: Sequelize.DATE, allowNull: false },
      estado: { type: Sequelize.ENUM('pendiente', 'completado', 'fallido', 'reembolsado'), defaultValue: 'completado' },
      ultimos4Digitos: { type: Sequelize.STRING(4) },
      tipoTarjeta: { type: Sequelize.STRING(50) },
      numeroCuota: { type: Sequelize.INTEGER },
      totalCuotas: { type: Sequelize.INTEGER },
      companiaSeguro: { type: Sequelize.STRING(150) },
      numeroPoliza: { type: Sequelize.STRING(100) },
      porcentajeCobertura: { type: Sequelize.DECIMAL(5, 2) },
      notas: { type: Sequelize.TEXT },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable('appointment_tracking', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      citaId: { type: Sequelize.INTEGER, allowNull: false },
      estadoAnterior: { type: Sequelize.STRING(50) },
      estadoNuevo: { type: Sequelize.STRING(50), allowNull: false },
      usuarioId: { type: Sequelize.INTEGER },
      motivoCambio: { type: Sequelize.TEXT },
      tipoAccion: { type: Sequelize.ENUM('creacion', 'confirmacion', 'cancelacion', 'reprogramacion', 'inicio', 'finalizacion', 'modificacion'), allowNull: false },
      datosModificados: { type: Sequelize.JSON },
      ipAddress: { type: Sequelize.STRING(45) },
      createdAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable('schedules', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      employeeId: { type: Sequelize.INTEGER, allowNull: false },
      diaSemana: { type: Sequelize.ENUM('lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'), allowNull: false },
      horaInicio: { type: Sequelize.TIME, allowNull: false },
      horaFin: { type: Sequelize.TIME, allowNull: false },
      disponible: { type: Sequelize.BOOLEAN, defaultValue: true },
      tipoJornada: { type: Sequelize.ENUM('completa', 'mañana', 'tarde', 'noche'), defaultValue: 'completa' },
      descansoInicio: { type: Sequelize.TIME },
      descansoFin: { type: Sequelize.TIME },
      notas: { type: Sequelize.TEXT },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable('discounts', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      codigo: { type: Sequelize.STRING(50), unique: true, allowNull: false },
      descripcion: { type: Sequelize.TEXT },
      tipo: { type: Sequelize.ENUM('porcentaje', 'fijo'), defaultValue: 'porcentaje' },
      valor: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      fechaInicio: { type: Sequelize.DATE, allowNull: false },
      fechaFin: { type: Sequelize.DATE, allowNull: false },
      usoMaximo: { type: Sequelize.INTEGER },
      vecesUsado: { type: Sequelize.INTEGER, defaultValue: 0 },
      estado: { type: Sequelize.ENUM('activo', 'inactivo', 'expirado'), defaultValue: 'activo' },
      aplicableA: { type: Sequelize.ENUM('servicios', 'productos', 'todo'), defaultValue: 'todo' },
      minimoCompra: { type: Sequelize.DECIMAL(10, 2) },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.addIndex('employees', ['usuarioId']);
    await queryInterface.addIndex('employees', ['dni']);
    await queryInterface.addIndex('employees', ['puesto']);
    await queryInterface.addIndex('notifications', ['usuarioId']);
    await queryInterface.addIndex('notifications', ['leida']);
    await queryInterface.addIndex('reminders', ['animalId']);
    await queryInterface.addIndex('reminders', ['usuarioId']);
    await queryInterface.addIndex('reminders', ['estado']);
    await queryInterface.addIndex('treatments', ['animalId']);
    await queryInterface.addIndex('treatments', ['veterinarioId']);
    await queryInterface.addIndex('treatments', ['estado']);
    await queryInterface.addIndex('vaccines', ['animalId']);
    await queryInterface.addIndex('vaccines', ['veterinarioId']);
    await queryInterface.addIndex('payment_methods', ['facturaId']);
    await queryInterface.addIndex('discounts', ['codigo']);
    await queryInterface.addIndex('discounts', ['estado']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('discounts');
    await queryInterface.dropTable('schedules');
    await queryInterface.dropTable('appointment_tracking');
    await queryInterface.dropTable('payment_methods');
    await queryInterface.dropTable('vaccines');
    await queryInterface.dropTable('suppliers');
    await queryInterface.dropTable('treatments');
    await queryInterface.dropTable('reminders');
    await queryInterface.dropTable('notifications');
    await queryInterface.dropTable('employees');
  }
};

