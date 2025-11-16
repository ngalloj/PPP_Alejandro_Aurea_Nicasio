import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = "http://localhost:3000/api/usuario";

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<{token:string}>(`${this.baseUrl}/login`, { email, password });
  }

  saveToken(token: string) { localStorage.setItem('token', token); }
  getToken() { return localStorage.getItem('token'); }
  isLoggedIn() { return !!this.getToken(); }

  isAdmin(): boolean {
    const t = this.getToken();
    if(!t) return false;
    const payload = JSON.parse(atob(t.split('.')[1]));
    return payload.rol === 'admin';
  }
}
