// frontend/src/app/models/historia-clinica.model.ts

import { Mascota } from './mascota.model';
import { User } from './user.model';
import { Cita } from './cita.model';

export interface HistoriaClinica {
  id: number;
  fecha: Date;
  motivo: string;
  sintomas?: string;
  diagnostico: string;
  tratamiento?: string;
  temperatura?: number;
  peso?: number;
  frecuenciaCardiaca?: number;
  frecuenciaRespiratoria?: number;
  examenFisico?: string;
  pruebas?: string;
  medicamentos?: string;
  observaciones?: string;
  proximaVisita?: Date;
  adjuntos?: any[];
  mascotaId: number;
  mascota?: Mascota;
  veterinarioId: number;
  veterinario?: User;
  citaId?: number;
  cita?: Cita;
  createdAt?: Date;
  updatedAt?: Date;
}
