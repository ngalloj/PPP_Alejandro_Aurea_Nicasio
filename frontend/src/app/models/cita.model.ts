// frontend/src/app/models/cita.model.ts

import { Mascota } from './mascota.model';
import { User } from './user.model';

export interface Cita {
  id: number;
  fecha: Date;
  hora: string;
  duracion: number;
  motivo: string;
  descripcion?: string;
  estado: 'pendiente' | 'confirmada' | 'en_curso' | 'completada' | 'cancelada' | 'no_asistio';
  tipo: 'consulta' | 'vacunacion' | 'cirugia' | 'revision' | 'urgencia' | 'otros';
  precio?: number;
  observaciones?: string;
  mascotaId: number;
  mascota?: Mascota;
  veterinarioId: number;
  veterinario?: User;
  clienteId: number;
  cliente?: User;
  recordatorio: boolean;
  recordatorioEnviado: boolean;
  historiaClinica?: any;
  createdAt?: Date;
  updatedAt?: Date;
}
