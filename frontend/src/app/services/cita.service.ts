import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class CitaService {
  private apiUrl = 'http://localhost:3000/api/cita';

  constructor(private http: HttpClient, private auth: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.auth.getToken();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // Get todas las citas
  getCitas(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getHeaders() });
  }

  // Get una cita por ID
  getCitaById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // Crear una nueva cita
  crearCita(datos: any): Observable<any> {
    return this.http.post(this.apiUrl, datos, { headers: this.getHeaders() });
  }

  // Editar una cita existente
  editarCita(id: string, datos: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, datos, { headers: this.getHeaders() });
  }

  // Eliminar una cita
  eliminarCita(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
