// frontend/src/app/pages/animal/animal.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { AnimalService } from '../../services/animal.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UploadFotoComponent } from '../../components/upload-foto/upload-foto.component';

@Component({
  selector: 'app-animal',
  standalone: true,
  imports: [
    MatFormFieldModule, 
    MatInputModule,
    CommonModule, 
    ReactiveFormsModule, 
    FormsModule, 
    MatCardModule, 
    MatTableModule, 
    MatButtonModule, 
    MatPaginatorModule,
    UploadFotoComponent
  ],
  templateUrl: './animal.component.html',
  styleUrls: ['./animal.component.css'],
})
export class AnimalComponent implements OnInit {
  animales: any[] = [];
  displayedColumns = ['foto', 'nombre', 'especie', 'propietario', 'motivo', 'fecha_atencion', 'acciones'];
  length = 0;
  pageSize = 10;
  pageIndex = 0;
  animalForm: FormGroup;
  fotoSeleccionada: File | null = null;

  constructor(private animalService: AnimalService, private fb: FormBuilder) {
    this.animalForm = this.fb.group({
      nombre: ['', Validators.required],
      especie: ['', Validators.required],
      edad: ['', Validators.required],
      peso: [''],
      usuario_dni: ['', [Validators.required, Validators.pattern(/^[0-9]{8}[A-Z]$/)]],
      motivo_atencion: [''],
      fecha_atencion: ['']
    });
  }

  ngOnInit() {
    this.cargarAnimales();
  }

  cargarAnimales(event?: PageEvent) {
    const page = event ? event.pageIndex + 1 : 1;
    const limit = event ? event.pageSize : this.pageSize;
    this.animalService.getAnimales(page, limit).subscribe({
      next: (data) => {
        console.log('Datos recibidos:', data);
        this.animales = data.results || data.data || data.animales || data;
        this.length = data.total || 100;
        this.pageIndex = page - 1;
        this.pageSize = limit;
      },
      error: (err) => {
        console.error('Error cargando animales:', err);
        alert('Error al cargar animales');
      }
    });
  }

  onFotoSeleccionada(file: File): void {
    this.fotoSeleccionada = file;
    console.log('Foto seleccionada:', file.name);
  }

  crearAnimal() {
    if (this.animalForm.valid) {
      const formData = new FormData();
      
      // Añadir todos los campos del formulario
      Object.keys(this.animalForm.value).forEach(key => {
        const value = this.animalForm.value[key];
        if (value !== null && value !== '') {
          formData.append(key, value);
        }
      });

      // Añadir foto si existe
      if (this.fotoSeleccionada) {
        formData.append('foto', this.fotoSeleccionada);
      }

      // Usar el método con foto
      this.animalService.crearAnimalConFoto(formData).subscribe({
        next: (response) => {
          console.log('Animal creado:', response);
          alert('¡Animal guardado correctamente!');
          this.animalForm.reset();
          this.fotoSeleccionada = null;
          this.cargarAnimales();
        },
        error: (err) => {
          console.error('Error completo:', err);
          alert('Error al guardar animal: ' + (err.error?.error || err.message));
        }
      });
    } else {
      alert('Por favor, completa todos los campos requeridos (nombre, especie, edad, DNI propietario)');
      
      // Mostrar qué campos tienen errores
      Object.keys(this.animalForm.controls).forEach(key => {
        const control = this.animalForm.get(key);
        if (control && control.invalid) {
          console.log(`Campo inválido: ${key}`, control.errors);
        }
      });
    }
  }

  getFotoUrl(fotoUrl: string): string {
    return this.animalService.getFotoUrl(fotoUrl);
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

  modificar(animal: any) {
    alert('Función de modificar: ' + animal.nombre);
    // Aquí puedes implementar la lógica de edición
  }

  eliminar(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este animal?')) {
      this.animalService.eliminarAnimal(id).subscribe({
        next: () => {
          alert('Animal eliminado correctamente');
          this.cargarAnimales();
        },
        error: (err) => {
          console.error('Error eliminando:', err);
          alert('Error al eliminar el animal');
        }
      });
    }
  }
}
