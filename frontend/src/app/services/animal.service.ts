// frontend/src/app/services/animal.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; // ✅ MANTENER

@Injectable({
  providedIn: 'root'
})
export class AnimalService {
  private apiUrl = 'http://localhost:3000/api/animales';

  constructor(
    private http: HttpClient,
    private authService: AuthService // ✅ MANTENER si lo usas
  ) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAnimales(page: number = 1, limit: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}?page=${page}&limit=${limit}`, { headers: this.getHeaders() });
  }

  getMisAnimales(): Observable<any> {
    return this.http.get(`${this.apiUrl}/mios`, { headers: this.getHeaders() });
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  crearAnimal(animal: any): Observable<any> {
    return this.http.post(this.apiUrl, animal, { headers: this.getHeaders() });
  }

  crearAnimalConFoto(formData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(this.apiUrl, formData, { headers });
  }

  actualizarAnimal(id: number, animal: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, animal, { headers: this.getHeaders() });
  }

  actualizarAnimalConFoto(id: number, formData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put(`${this.apiUrl}/${id}`, formData, { headers });
  }

  eliminarAnimal(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getFotoUrl(fotoUrl: string): string {
    if (!fotoUrl) return '';
    return `http://localhost:3000${fotoUrl}`;
  }
}
