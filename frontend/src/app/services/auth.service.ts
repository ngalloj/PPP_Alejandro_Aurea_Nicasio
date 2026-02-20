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
   * BASE del backend (Render)
   * OJO: aquí NO va /signin, solo la base /api
   */
  private readonly apiBase = 'https://clinicaveterinaria2-0.onrender.com/api';

  private readonly tokenKey = 'access_token';
  private readonly userKey = 'usuario';

  constructor(private http: HttpClient) {}

  /** POST /api/usuario/signin */
  login(email: string, password: string): Observable<LoginResponse> {
    const body = { email, contrasena: password };
    return this.http.post<LoginResponse>(`${this.apiBase}/usuario/signin`, body);
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

  /** Para endpoints protegidos */
  authHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
  }

  /** Ejemplo: GET /api/usuario (protegido) */
  getUsuarios() {
    return this.http.get(`${this.apiBase}/usuario`, { headers: this.authHeaders() });
  }
}