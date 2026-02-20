import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginResponse {
  usuario: {
    idUsuario?: number;
    email?: string;
    rol?: string;
    nombre?: string;
  };
  access_token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  /**
   * En producción (Netlify) debe apuntar a Render.
   * En local (localhost) apunta a tu API local.
   */
  private readonly API_BASE =
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? 'http://localhost:8080'
      : 'https://clinicaveterinaria2-0.onrender.com';

  // Base de usuario (SIN /signin al final)
  private readonly apiUrl = `${this.API_BASE}/api/usuario`;

  private tokenKey = 'access_token';
  private userKey = 'usuario';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    // el backend espera "contrasena"
    const body = { email, contrasena: password };
    return this.http.post<LoginResponse>(`${this.apiUrl}/signin`, body);
  }

  saveSession(resp: LoginResponse) {
    localStorage.setItem(this.tokenKey, resp.access_token);
    localStorage.setItem(this.userKey, JSON.stringify(resp.usuario));
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUser(): any | null {
    const raw = localStorage.getItem(this.userKey);
    return raw ? JSON.parse(raw) : null;
  }

  getUserRole(): string | null {
    return this.getUser()?.rol ?? null;
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  authHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
  }

  // Ejemplo de endpoint protegido
  getUsuarios() {
    return this.http.get(`${this.apiUrl}`, { headers: this.authHeaders() });
  }
}