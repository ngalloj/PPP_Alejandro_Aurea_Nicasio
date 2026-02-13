// frontend/src/app/services/socket.service.ts
import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket | null = null;
  private serverUrl = 'http://localhost:3000';
  
  // Subjects para diferentes tipos de eventos
  private nuevaCitaSubject = new Subject<any>();
  private citaActualizadaSubject = new Subject<any>();
  private citaRapidaSubject = new Subject<any>();
  private connectionStatusSubject = new BehaviorSubject<boolean>(false);

  // Observables públicos
  public nuevaCita$ = this.nuevaCitaSubject.asObservable();
  public citaActualizada$ = this.citaActualizadaSubject.asObservable();
  public citaRapida$ = this.citaRapidaSubject.asObservable();
  public connectionStatus$ = this.connectionStatusSubject.asObservable();

  constructor() {}

  /**
   * Conectar al servidor Socket.io
   */
  connect(): void {
    if (this.socket && this.socket.connected) {
      console.log('🔌 Socket ya está conectado');
      return;
    }

    this.socket = io(this.serverUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    this.setupListeners();
  }

  /**
   * Configurar listeners de eventos
   */
  private setupListeners(): void {
    if (!this.socket) return;

    // Evento de conexión
    this.socket.on('connect', () => {
      console.log('✅ Socket conectado:', this.socket?.id);
      this.connectionStatusSubject.next(true);
    });

    // Evento de desconexión
    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket desconectado:', reason);
      this.connectionStatusSubject.next(false);
    });

    // Evento de error
    this.socket.on('connect_error', (error) => {
      console.error('❌ Error de conexión Socket:', error);
      this.connectionStatusSubject.next(false);
    });

    // Evento: Nueva cita creada
    this.socket.on('nuevaCita', (data) => {
      console.log('📅 Nueva cita recibida:', data);
      this.nuevaCitaSubject.next(data);
    });

    // Evento: Cita actualizada
    this.socket.on('citaActualizada', (data) => {
      console.log('🔄 Cita actualizada:', data);
      this.citaActualizadaSubject.next(data);
    });

    // Evento: Nueva cita rápida
    this.socket.on('nueva-cita-rapida', (data) => {
      console.log('⚡ Cita rápida recibida:', data);
      this.citaRapidaSubject.next(data);
    });
  }

  /**
   * Desconectar del servidor
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connectionStatusSubject.next(false);
      console.log('🔌 Socket desconectado manualmente');
    }
  }

  /**
   * Emitir un evento personalizado
   */
  emit(event: string, data: any): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('⚠️ Socket no conectado, no se puede emitir evento');
    }
  }

  /**
   * Escuchar un evento personalizado
   */
  on(event: string): Observable<any> {
    return new Observable(observer => {
      if (this.socket) {
        this.socket.on(event, (data: any) => {
          observer.next(data);
        });
      }
    });
  }

  /**
   * Verificar si está conectado
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}
