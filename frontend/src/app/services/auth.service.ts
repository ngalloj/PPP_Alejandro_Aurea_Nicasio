// src/app/services/auth.service.ts
// ----------------------------------------------------------
// Servicio de autenticación compatible con el resto de la app:
// - login() contra /api/usuario/signin
// - guarda token + usuario en localStorage
// - getUser(), getUserRole(), getUsuarios(), saveSession(), authHeaders()
// ----------------------------------------------------------

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Role, Usuario } from '../services/usuario.service';

// La respuesta real del backend; ajusta los campos si tu API devuelve otros nombres
export interface LoginResponse {
  token: string;          // JWT devuelto por el backend
  usuario: Usuario;       // Usuario autenticado
}

// Claves usadas en localStorage
const TOKEN_KEY = 'token';
const USER_KEY = 'user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  /** En dev:  http://localhost:8080/api/usuario/signin
   *  En prod: https://ppp-alejandro-aurea-nicasio.onrender.com/api/usuario/signin
   */
  private loginUrl = `${environment.apiUrl}/usuario/signin`;

  constructor(private http: HttpClient) {}

  // -------------------------
  // LOGIN
  // -------------------------
  login(email: string, contrasena: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.loginUrl, { email, contrasena }).pipe(
      tap(res => {
        this.saveSession(res);
      })
    );
  }

  // Guarda token + usuario en localStorage
  saveSession(response: LoginResponse): void {
    if (response?.token) {
      localStorage.setItem(TOKEN_KEY, response.token);
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

  // Devuelve el idUsuario del usuario logueado (o 0 si no hay)
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
  // Helpers usados en varias páginas
  // -------------------------
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  /**
   * Método de conveniencia para páginas que pedían this.auth.getUsuarios()
   * Aquí delegamos realmente al endpoint /api/usuario, usando el propio AuthService.
   * Si prefieres, puedes cambiar este método para usar directamente UsuarioService.
   */
  getUsuarios(): Observable<Usuario[]> {
    const url = `${environment.apiUrl}/usuario`;
    return this.http.get<Usuario[]>(url, {
      headers: this.authHeaders(),
    });
  }
}
