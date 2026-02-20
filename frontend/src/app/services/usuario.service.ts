import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';

export type Role = 'administrativo' | 'veterinario' | 'recepcionista' | 'cliente';

export interface Usuario {
  idUsuario: number;
  nif: string | null;
  nombre: string;
  apellidos: string | null;
  email: string;
  telefono: string | null;
  direccion: string | null;
  foto: string | null;
  rol: Role;
  contrasena?: string; // (temporal, mejor quitarlo luego)
}

export interface CreateUsuarioDto {
  nombre?: string;
  apellidos?: string;
  email: string;
  rol?: Role;
  nif?: string;
  direccion?: string;
  telefono?: string;
  contrasena: string;
}

export interface UpdateUsuarioDto {
  nombre?: string;
  apellidos?: string;
  email?: string;
  rol?: Role;
  nif?: string;
  direccion?: string;
  telefono?: string;
  contrasena?: string;
}

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly apiUrl = `${environment.apiBaseUrl}/api/usuario`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl, {
      headers: this.authService.authHeaders(),
    });
  }

  getUsuarioById(idUsuario: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${idUsuario}`, {
      headers: this.authService.authHeaders(),
    });
  }

  createUsuario(payload: CreateUsuarioDto): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, payload, {
      headers: this.authService.authHeaders(),
    });
  }

  updateUsuario(idUsuario: number, payload: UpdateUsuarioDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/${idUsuario}`, payload, {
      headers: this.authService.authHeaders(),
    });
  }

  deleteUsuario(idUsuario: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${idUsuario}`, {
      headers: this.authService.authHeaders(),
    });
  }
}