import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket | null = null;
  private readonly serverUrl = 'http://localhost:3000';

  constructor() {
    this.connect();
  }

  connect(): void {
    if (!this.socket) {
      this.socket = io(this.serverUrl, {
        transports: ['websocket'],
        autoConnect: true
      });

      this.socket.on('connect', () => {
        console.log('✅ Socket conectado:', this.socket?.id);
      });

      this.socket.on('disconnect', (reason: string) => {
        console.log('❌ Socket desconectado:', reason);
      });

      this.socket.on('connect_error', (error: Error) => {
        console.error('❌ Error de conexión:', error);
      });

      this.socket.on('cita-actualizada', (data: any) => {
        console.log('📅 Cita actualizada:', data);
      });

      this.socket.on('notificacion-nueva', (data: any) => {
        console.log('🔔 Nueva notificación:', data);
      });

      this.socket.on('recordatorio-nuevo', (data: any) => {
        console.log('⏰ Nuevo recordatorio:', data);
      });
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit(eventName: string, data: any): void {
    if (this.socket) {
      this.socket.emit(eventName, data);
    }
  }

  on(eventName: string): Observable<any> {
    return new Observable((observer) => {
      if (this.socket) {
        this.socket.on(eventName, (data: any) => {
          observer.next(data);
        });
      }
    });
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}
