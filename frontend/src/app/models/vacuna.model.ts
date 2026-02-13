// frontend/src/app/models/vacuna.model.ts

import { Mascota } from './mascota.model';
import { User } from './user.model';

export interface Vacuna {
  id: number;
  nombre: string;
  lote?: string;
  fabricante?: string;
  fechaAplicacion: Date;
  proximaDosis?: Date;
  dosis?: string;
  observaciones?: string;
  reaccionesAdversas?: string;
  mascotaId: number;
  mascota?: Mascota;
  veterinarioId: number;
  veterinario?: User;
  createdAt?: Date;
  updatedAt?: Date;
}
