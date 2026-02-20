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
  // Base URL del backend (Render)
  private readonly API_BASE = 'https://clinicaveterinaria2-0.onrender.com/api';

  private readonly tokenKey = 'access_token';
  private readonly userKey = 'usuario';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    // el backend espera "contrasena"
    const body = { email, contrasena: password };

    // ✅ endpoint correcto: /api/usuario/signin
    return this.http.post<LoginResponse>(`${this.API_BASE}/usuario/signin`, body);
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

  // Ejemplo: endpoint protegido (lista usuarios)
  getUsuarios() {
    return this.http.get(`${this.API_BASE}/usuario`, { headers: this.authHeaders() });
  }
}