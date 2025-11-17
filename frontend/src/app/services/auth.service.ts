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
  isLoggedIn() { 
    const token = this.getToken();
    return !!token && token.split('.').length === 3; // es probable JWT
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

}
