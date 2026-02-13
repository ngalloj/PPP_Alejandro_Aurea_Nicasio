// frontend/src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, AuthResponse, LoginRequest } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:3000/api/usuarios';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, { email, password });
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  saveUsuario(usuario: User): void {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  getUsuario(): User | null {
    const u = localStorage.getItem('usuario');
    return u ? JSON.parse(u) : null;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token || token.split('.').length !== 3) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp) {
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp < now) return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  getUserFromToken(): any {
    const t = this.getToken();
    if (!t) return null;
    try {
      return JSON.parse(atob(t.split('.')[1]));
    } catch {
      return null;
    }
  }

  // ✅ MÉTODO PRINCIPAL
  getRole(): string {
    const usuario = this.getUsuario();
    if (usuario && usuario.rol) return usuario.rol;

    const tokenData = this.getUserFromToken();
    return tokenData?.rol || '';
  }

  // ✅ ALIAS (para compatibilidad)
  getUserRole(): string {
    return this.getRole();
  }

  // ✅ MÉTODOS DE VERIFICACIÓN
  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }

  isVeterinario(): boolean {
    return this.getRole() === 'veterinario';
  }

  isRecepcionista(): boolean {
    return this.getRole() === 'recepcionista';
  }

  isCliente(): boolean {
    return this.getRole() === 'cliente';
  }

  // ✅ PERMISOS COMPUESTOS
  canModifyUsers(): boolean {
    const rol = this.getRole();
    return rol === 'admin' || rol === 'veterinario';
  }

  canDeleteUsers(): boolean {
    const rol = this.getRole();
    return rol === 'admin' || rol === 'veterinario';
  }

  canCreateUsers(): boolean {
    const rol = this.getRole();
    return rol === 'admin' || rol === 'veterinario' || rol === 'recepcionista';
  }

  canAccessFullCRUD(): boolean {
    const rol = this.getRole();
    return rol === 'admin' || rol === 'veterinario' || rol === 'recepcionista';
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }
}
