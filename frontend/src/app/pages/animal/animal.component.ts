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
;

@Component({
  selector: 'app-animal',
  standalone: true,
  imports: [MatFormFieldModule, CommonModule, ReactiveFormsModule, FormsModule, MatCardModule, MatTableModule, MatButtonModule, MatPaginatorModule],
  templateUrl: './animal.component.html',
  styleUrls: ['./animal.component.css'],
})
export class AnimalComponent implements OnInit {
  animales: any[] = [];
  displayedColumns = ['nombre', 'especie', 'propietario', 'edad', 'acciones'];
  length = 0;
  pageSize = 10;
  pageIndex = 0;
  animalForm: FormGroup;

  constructor(private animalService: AnimalService, private fb: FormBuilder) {
    this.animalForm = this.fb.group({
      nombre: ['', Validators.required],
      especie: ['', Validators.required],
      edad: ['', Validators.required],
      propietario: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.cargarAnimales();
  }

  cargarAnimales(event?: PageEvent) {
    const page = event ? event.pageIndex + 1 : 1;
    const limit = event ? event.pageSize : this.pageSize;
    this.animalService.getAnimales(page, limit).subscribe(data => {
      this.animales = data.results || data.animales || data;
      this.length = data.total || 100;
      this.pageIndex = page - 1;
      this.pageSize = limit;
    });
  }

  crearAnimal() {
    if (this.animalForm.valid) {
      this.animalService.crearAnimal(this.animalForm.value).subscribe({
        next: () => {
          alert('¡Animal guardado!');
          this.animalForm.reset();
          this.cargarAnimales();
        },
        error: () => alert('Error al guardar animal')
      });
    }
  }

  modificar(animal: any) {
    alert('Modificar: ' + animal.nombre);
  }
}
