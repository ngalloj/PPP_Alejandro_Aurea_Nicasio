// frontend/src/app/services/recepcionista.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  DashboardStats,
  CitaHoy,
  CitaRapida,
  Cliente,
  Veterinario,
  CobroRequest,
  AlertaInventario
} from '../models/recepcionista.model';

@Injectable({
  providedIn: 'root'
})
export class RecepcionistaService {
  private apiUrl = 'http://localhost:3000/api/recepcionista';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // ==================== DASHBOARD ====================
  
  getDashboard(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(
      `${this.apiUrl}/dashboard`,
      { headers: this.getHeaders() }
    );
  }

  getEstadisticas(): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/estadisticas`,
      { headers: this.getHeaders() }
    );
  }

  // ==================== CITAS ====================

  getColaEspera(): Observable<{ total: number; cola: CitaHoy[]; timestamp: Date }> {
    return this.http.get<{ total: number; cola: CitaHoy[]; timestamp: Date }>(
      `${this.apiUrl}/cola-espera`,
      { headers: this.getHeaders() }
    );
  }

  getCitasDelDia(): Observable<{ total: number; citas: CitaHoy[]; timestamp: Date }> {
    return this.http.get<{ total: number; citas: CitaHoy[]; timestamp: Date }>(
      `${this.apiUrl}/citas/hoy`,
      { headers: this.getHeaders() }
    );
  }

  crearCita(cita: any): Observable<CitaHoy> {
    return this.http.post<CitaHoy>(
      `${this.apiUrl}/citas`,
      cita,
      { headers: this.getHeaders() }
    );
  }

  crearCitaRapida(cita: CitaRapida): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/citas/rapida`,
      cita,
      { headers: this.getHeaders() }
    );
  }

  actualizarEstadoCita(citaId: number, estado: string): Observable<CitaHoy> {
    return this.http.patch<CitaHoy>(
      `${this.apiUrl}/citas/${citaId}/estado`,
      { estado },
      { headers: this.getHeaders() }
    );
  }

  // ==================== BÚSQUEDAS ====================

  buscarCliente(query: string): Observable<{ total: number; clientes: Cliente[] }> {
    const params = new HttpParams().set('query', query);
    return this.http.get<{ total: number; clientes: Cliente[] }>(
      `${this.apiUrl}/clientes/buscar`,
      { headers: this.getHeaders(), params }
    );
  }

  getVeterinariosDisponibles(fecha?: string): Observable<{ total: number; veterinarios: Veterinario[] }> {
    let params = new HttpParams();
    if (fecha) {
      params = params.set('fecha', fecha);
    }
    return this.http.get<{ total: number; veterinarios: Veterinario[] }>(
      `${this.apiUrl}/veterinarios/disponibles`,
      { headers: this.getHeaders(), params }
    );
  }

  // ==================== COBROS ====================

  cobrarConInventario(cobro: CobroRequest): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/cobrar`,
      cobro,
      { headers: this.getHeaders() }
    );
  }

  getClientesConDeuda(): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/clientes/deuda`,
      { headers: this.getHeaders() }
    );
  }

  // ==================== INVENTARIO ====================

  getAlertasInventario(): Observable<{ total_critico: number; items: AlertaInventario[] }> {
    return this.http.get<{ total_critico: number; items: AlertaInventario[] }>(
      `${this.apiUrl}/inventario/alertas`,
      { headers: this.getHeaders() }
    );
  }

  // ==================== WHATSAPP ====================

  confirmarClienteWhatsApp(citaId: number, clientePhone: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/whatsapp/confirmar`,
      { citaId, clientePhone },
      { headers: this.getHeaders() }
    );
  }
}
