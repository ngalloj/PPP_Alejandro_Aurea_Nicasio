// frontend/src/app/components/mis-citas/mis-citas.components.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { CitaService } from '../../services/cita.service';
import { AuthService } from '../../services/auth.service';

interface Cita {
  id: number;
  fecha: string;
  hora: string;
  motivo: string;
  estado: string;
  animal?: {
    nombre: string;
    especie: string;
  };
}

@Component({
  selector: 'app-mis-citas',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './mis-citas.component.html',
  styleUrls: ['./mis-citas.component.css']
})
export class MisCitasComponent implements OnInit {
  citasPasadas: Cita[] = [];
  citasFuturas: Cita[] = [];
  displayedColumns: string[] = ['fecha', 'hora', 'animal', 'motivo', 'estado'];
  cargando = true;

  constructor(
    private citaService: CitaService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarMisCitas();
  }

  cargarMisCitas(): void {
    this.cargando = true;
    this.citaService.getMisCitas().subscribe({
      next: (response) => {
        this.citasPasadas = response.citasPasadas || [];
        this.citasFuturas = response.citasFuturas || [];
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar citas:', error);
        this.cargando = false;
      }
    });
  }

  getEstadoColor(estado: string): string {
    switch (estado?.toLowerCase()) {
      case 'pendiente':
        return 'accent';
      case 'confirmada':
        return 'primary';
      case 'completada':
        return 'primary';
      case 'cancelada':
        return 'warn';
      default:
        return '';
    }
  }

  formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}
