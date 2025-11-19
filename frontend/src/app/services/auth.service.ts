// frontend/src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = "http://localhost:3000/api/usuario";

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<{token:string}>(`${this.baseUrl}/login`, { email, password });
  }

  saveToken(token: string) { localStorage.setItem('token', token); }
  getToken() { return localStorage.getItem('token'); }
  
  isLoggedIn(): boolean {
    const token = this.getToken();
    // Debe ser un JWT válido (tres partes separadas por '.')
    if (!token || token.split('.').length !== 3) return false;
    // Aquí puedes añadir más validaciones como fecha de expiración si el payload la tiene
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp) {
        // Si tu JWT tiene fecha de expiración
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp < now) return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  isAdmin(): boolean {
    const t = this.getToken();
    if (!t || t.trim() === '' || t.split('.').length !== 3) return false;
    try {
      const payload = JSON.parse(atob(t.split('.')[1]));
      return payload.rol === 'admin';
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return false;
    }
  }

  logout() {
    localStorage.removeItem('token');
  }

  register(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, { email, password });
  }

  getRole(): string {
    const token = this.getToken();
    if (!token) return '';
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.rol || '';
    } catch {
      return '';
    }
  }

  // auth.service.ts
getUserFromToken() {
  const t = this.getToken();
  if (!t) return null;
  try {
    return JSON.parse(atob(t.split('.')[1]));
  } catch {
    return null;
  }
}

}
