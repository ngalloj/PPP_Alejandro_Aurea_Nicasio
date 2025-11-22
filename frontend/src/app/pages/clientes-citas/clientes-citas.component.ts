// frontend/src/app/pages/clientes-citas/clientes-citas.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { CitaService } from '../../services/cita.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-clientes-citas',
  standalone: true,
  imports: [
    MatFormFieldModule, 
    MatInputModule,
    CommonModule, 
    ReactiveFormsModule, 
    FormsModule, 
    MatCardModule, 
    MatTableModule, 
    MatButtonModule
  ],
  templateUrl: './clientes-citas.component.html',
  styleUrls: ['./clientes-citas.component.css']
})
export class ClientesCitasComponent implements OnInit {
  citas: any[] = [];
  displayedColumns = ['usuario_dni', 'animal', 'fecha', 'motivo', 'accion']; // ✅ ACTUALIZADO
  citaForm: FormGroup;

  constructor(private citaService: CitaService, private fb: FormBuilder) {
    this.citaForm = this.fb.group({
      usuario_dni: ['', [Validators.required, Validators.pattern(/^[0-9]{8}[A-Z]$/)]], // ✅ CAMBIO: cliente → usuario_dni
      animal_id: [''], // ✅ CAMBIO: animal → animal_id (opcional)
      fecha: ['', Validators.required],
      motivo: [''] // ✅ NUEVO
    });
  }

  ngOnInit() {
    this.cargarCitas();
  }

  cargarCitas() {
    this.citaService.getCitas().subscribe({
      next: (data) => {
        this.citas = data.citas || data;
      },
      error: (err) => console.error('Error cargando citas:', err)
    });
  }

  crearCita() {
    if (this.citaForm.valid) {
      this.citaService.crearCita(this.citaForm.value).subscribe({
        next: () => {
          alert('¡Cita guardada correctamente!');
          this.citaForm.reset();
          this.cargarCitas();
        },
        error: (err) => {
          console.error('Error:', err);
          alert('Error al guardar la cita: ' + (err.error?.error || err.message));
        }
      });
    } else {
      alert('Por favor, completa todos los campos requeridos');
    }
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return 'Sin fecha';
    return new Date(fecha).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  verCliente(cita: any) {
    alert(`DNI Cliente: ${cita.usuario_dni}\nFecha: ${this.formatearFecha(cita.fecha)}`);
  }

  eliminar(id: number) {
    if (confirm('¿Eliminar esta cita?')) {
      this.citaService.eliminarCita(id).subscribe({
        next: () => {
          alert('Cita eliminada');
          this.cargarCitas();
        },
        error: (err) => {
          console.error('Error eliminando:', err);
          alert('Error al eliminar');
        }
      });
    }
  }
}
