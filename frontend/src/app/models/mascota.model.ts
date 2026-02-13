// frontend/src/app/models/mascota.model.ts

import { User } from './user.model';

export interface Mascota {
  id: number;
  nombre: string;
  especie: 'perro' | 'gato' | 'ave' | 'roedor' | 'reptil' | 'otro';
  raza?: string;
  sexo: 'macho' | 'hembra';
  fechaNacimiento?: Date;
  color?: string;
  peso?: number;
  microchip?: string;
  esterilizado: boolean;
  foto?: string;
  observaciones?: string;
  activo: boolean;
  propietarioId: number;
  propietario?: User;
  citas?: any[];
  historiasClinicas?: any[];
  vacunas?: any[];
  createdAt?: Date;
  updatedAt?: Date;
}
