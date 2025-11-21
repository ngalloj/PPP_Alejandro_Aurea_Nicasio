// frontend/src/app/services/animal.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AnimalService {
  private apiUrl = 'http://localhost:3000/api/animal';

  constructor(private http: HttpClient, private auth: AuthService) {}

  getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.auth.getToken()}`
    });
  }

  getAnimales(page = 1, limit = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}?page=${page}&limit=${limit}`, { headers: this.getHeaders() });
  }

  getMisAnimales(): Observable<any> {
    return this.http.get(`${this.apiUrl}/mios`, { headers: this.getHeaders() });
  }

  crearAnimal(datos: any) {
    return this.http.post(this.apiUrl, datos, { headers: this.getHeaders() });
  }
  

  modificarAnimal(animalId: string, datos: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${animalId}`, datos, { headers: this.getHeaders() });
  }
}
