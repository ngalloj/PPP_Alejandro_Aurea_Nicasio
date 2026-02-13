// frontend/src/app/models/user.model.ts

export interface User {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  telefono?: string;
  rol: 'admin' | 'veterinario' | 'recepcionista' | 'cliente';
  activo: boolean;
  avatar?: string;
  dni?: string;
  direccion?: string;
  ciudad?: string;
  codigoPostal?: string;
  fechaNacimiento?: Date;
  ultimoAcceso?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthResponse {
  usuario: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
