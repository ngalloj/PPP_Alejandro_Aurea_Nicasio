// src/app/services/auth.service.ts
// ----------------------------------------------------------
// Servicio de autenticación:
// - login() contra /api/usuario/signin
// - guarda access_token + usuario en localStorage
// - expone getUser(), getUserRole(), getUserId(), authHeaders(), getUsuarios()
// ----------------------------------------------------------

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Role, Usuario } from './usuario.service';

// Respuesta de login tal y como la devuelve tu backend
// {
//   "usuario": { ... },
//   "access_token": "eyJhbGciOiJI..."
// }
export interface LoginResponse {
  access_token: string;
  usuario: Usuario;
}

// Claves para localStorage
const TOKEN_KEY = 'token';
const USER_KEY = 'user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  /** 
   * En dev:  http://localhost:8080/api/usuario/signin
   * En prod: https://ppp-alejandro-aurea-nicasio.onrender.com/api/usuario/signin
   */
  private loginUrl = `${environment.apiUrl}/usuario/signin`;

  constructor(private http: HttpClient) {}

  // -------------------------
  // LOGIN
  // -------------------------
  login(email: string, contrasena: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.loginUrl, { email, contrasena }).pipe(
      tap((res: LoginResponse) => this.saveSession(res))
    );
  }

  // Guarda token + usuario en localStorage
  saveSession(response: LoginResponse): void {
    if (response?.access_token) {
      localStorage.setItem(TOKEN_KEY, response.access_token);
    }
    if (response?.usuario) {
      localStorage.setItem(USER_KEY, JSON.stringify(response.usuario));
    }
  }

  // -------------------------
  // ACCESO A TOKEN/USUARIO
  // -------------------------
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  getUser(): Usuario | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as Usuario;
    } catch {
      return null;
    }
  }

  getUserRole(): Role | null {
    return this.getUser()?.rol ?? null;
  }

  getUserId(): number {
    return Number(this.getUser()?.idUsuario ?? 0);
  }

  // -------------------------
  // CABECERAS AUTH
  // -------------------------
  authHeaders(): HttpHeaders {
    const token = this.getToken();
    const headers: any = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return new HttpHeaders(headers);
  }

  // -------------------------
  // Helpers
  // -------------------------
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  /**
   * Helper para componentes que usaban this.auth.getUsuarios().
   * Devuelve la lista de usuarios desde /api/usuario (requiere token).
   */
  getUsuarios(): Observable<Usuario[]> {
    const url = `${environment.apiUrl}/usuario`;
    return this.http.get<Usuario[]>(url, {
      headers: this.authHeaders(),
    });
  }
}
