// frontend/src/app/services/cita.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; // ✅ MANTENER

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  private apiUrl = 'http://localhost:3000/api/citas';

  constructor(
    private http: HttpClient,
    private authService: AuthService // ✅ MANTENER si lo usas
  ) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getCitas(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getHeaders() });
  }

  getMisCitas(): Observable<any> {
    return this.http.get(`${this.apiUrl}/mias`, { headers: this.getHeaders() });
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  crearCita(cita: any): Observable<any> {
    return this.http.post(this.apiUrl, cita, { headers: this.getHeaders() });
  }

  actualizarCita(id: number, cita: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, cita, { headers: this.getHeaders() });
  }

  eliminarCita(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
