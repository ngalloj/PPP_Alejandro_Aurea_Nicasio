// src/app/services/auth.service.ts
// ----------------------------------------------------------
// Servicio de autenticación: login y gestión de token
// ----------------------------------------------------------

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

interface LoginResponse {
  token: string;
  // aquí puedes añadir usuario, rol, etc. según devuelva el backend
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  /** En dev:  http://localhost:8080/api/usuario/signin
   *  En prod: https://ppp-alejandro-aurea-nicasio.onrender.com/api/usuario/signin
   */
  private loginUrl = `${environment.apiUrl}/usuario/signin`;

  constructor(private http: HttpClient) {}

  /** Hace login contra el backend */
  login(email: string, contrasena: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.loginUrl, { email, contrasena }).pipe(
      tap(res => {
        if (res && res.token) {
          localStorage.setItem('token', res.token);
        }
      })
    );
  }

  /** Devuelve cabeceras con Authorization: Bearer <token> */
  authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
