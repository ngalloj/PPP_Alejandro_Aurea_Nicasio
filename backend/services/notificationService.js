// backend/services/notificationService.js
// Socket.io eventos para notificaciones realtime

const registerSocketEvents = (io) => {
    io.on('connection', (socket) => {
      console.log(`✅ Usuario conectado: ${socket.id}`);
      
      // Recepcionista se une a sala
      socket.on('join-recepcionista', (clinicId) => {
        socket.join(`recepcionista-${clinicId}`);
        console.log(`📋 Recepcionista en sala: recepcionista-${clinicId}`);
      });
      
      // Veterinario se une a sala
      socket.on('join-veterinario', (veterinarioId) => {
        socket.join(`vet-${veterinarioId}`);
        console.log(`👨‍⚕️ Veterinario en sala: vet-${veterinarioId}`);
      });
      
      // Cliente se une
      socket.on('join-cliente', (clienteId) => {
        socket.join(`cliente-${clienteId}`);
        console.log(`🐾 Cliente en sala: cliente-${clienteId}`);
      });
      
      socket.on('disconnect', () => {
        console.log(`❌ Usuario desconectado: ${socket.id}`);
      });
    });
  };
  
  // Emitir nueva cita a recepcionistas
  const emitNuevaCita = (io, clinicId, citaData) => {
    io.to(`recepcionista-${clinicId}`).emit('nueva-cita', {
      id: citaData.id,
      petName: citaData.Animal.nombre_animal,
      time: citaData.fecha,
      veterinario: citaData.veterinarioId,
      motivo: citaData.motivo
    });
  };
  
  // Alerta stock bajo a recepcionistas
  const emitStockAlerta = (io, clinicId, item) => {
    io.to(`recepcionista-${clinicId}`).emit('inventory:alerta-stock', {
      producto: item.name,
      stock: item.stock,
      minStock: item.minStock,
      urgencia: item.stock === 0 ? 'CRÍTICA' : 'MEDIA'
    });
  };
  
  // Notificar veterinario: nueva cita
  const emitNewAppointmentToVet = (io, vetId, citaData) => {
    io.to(`vet-${vetId}`).emit('appointment:nuevo', {
      id: citaData.id,
      petName: citaData.Animal.nombre_animal,
      time: citaData.fecha,
      reason: citaData.motivo,
      owner: citaData.Animal.Usuario.email
    });
  };
  
  // Notificar cliente: estado cita
  const emitAppointmentStatus = (io, clienteId, status, message) => {
    io.to(`cliente-${clienteId}`).emit('cita:estado', { status, message });
  };
  
  module.exports = {
    registerSocketEvents,
    emitNuevaCita,
    emitStockAlerta,
    emitNewAppointmentToVet,
    emitAppointmentStatus
  };