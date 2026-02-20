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
  // ✅ Base de tu backend en Render (SIN /api...)
  private readonly baseUrl = 'https://clinicaveterinaria2-0.onrender.com';

  private tokenKey = 'access_token';
  private userKey = 'usuario';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    const body = { email, contrasena: password };
    // ✅ endpoint correcto (una sola vez)
    return this.http.post<LoginResponse>(`${this.baseUrl}/api/usuario/signin`, body);
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

  // Ejemplo de llamada protegida
  getUsuarios() {
    return this.http.get(`${this.baseUrl}/api/usuario`, { headers: this.authHeaders() });
  }
}