// frontend/src/app/models/recepcionista.model.ts

export interface DashboardStats {
    resumen: {
      citasHoy: number;
      completadas: number;
      pendientes: number;
      canceladas: number;
      tasaCompletacion: string;
    };
    alertas: {
      stockBajo: number;
      deudaPendiente: number;
    };
    timestamp: Date;
  }
  
  export interface CitaHoy {
    id: number;
    fecha: Date;
    motivo: string;
    observaciones?: string;
    estado: 'pendiente' | 'completada' | 'cancelada';
    animal: {
      id: number;
      nombre: string;
      especie: string;
      raza: string;
      propietario: {
        id: number;
        nombre: string;
        email: string;
        telefono: string;
      };
    };
    veterinario?: {
      id: number;
      nombre: string;
      email: string;
    };
  }
  
  export interface CitaRapida {
    telefonoCliente: string;
    motivo: string;
    nombreCliente: string;
    veterinarioId?: number;
  }
  
  export interface Cliente {
    id: number;
    email: string;
    nombre: string;
    telefono: string;
    rol: string;
    mascotas: Array<{
      id: number;
      nombre: string;
      especie: string;
      raza: string;
    }>;
  }
  
  export interface Veterinario {
    id: number;
    nombre: string;
    email: string;
  }
  
  export interface ItemCobro {
    concepto: string;
    cantidad: number;
    precioUnitario: number;
    inventarioId?: number;
  }
  
  export interface CobroRequest {
    citaId: number;
    metodoPago: 'efectivo' | 'tarjeta' | 'transferencia';
    items: ItemCobro[];
  }
  
  export interface AlertaInventario {
    id: number;
    nombre: string;
    cantidad: number;
    stockMinimo: number;
    urgencia: 'CRÍTICA' | 'BAJA';
    proveedor?: string;
  }
  