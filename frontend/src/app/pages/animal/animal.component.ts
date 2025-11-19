// frontend/src/app/pages/animal/animal.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { AnimalService } from '../../services/animal.service';

@Component({
  selector: 'app-animal',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatTableModule, MatButtonModule, MatPaginatorModule
  ],
  templateUrl: './animal.component.html',
  styleUrls: ['./animal.component.css'],
})
export class AnimalComponent implements OnInit {
  animales: any[] = [];
  displayedColumns = ['nombre', 'especie', 'propietario', 'edad', 'acciones'];
  length = 0;
  pageSize = 10;
  pageIndex = 0;

  constructor(private animalService: AnimalService) { }

  ngOnInit() {
    this.cargarAnimales();
  }

  cargarAnimales(event?: PageEvent) {
    const page = event ? event.pageIndex + 1 : 1;
    const limit = event ? event.pageSize : this.pageSize;
    this.animalService.getAnimales(page, limit).subscribe(data => {
      this.animales = data.results || data.animales || data;
      this.length = data.total || 100; // tu backend debe devolver total o num. total de registros
      this.pageIndex = page - 1;
      this.pageSize = limit;
    });
  }

  modificar(animal: any) {
    alert('Modificar: ' + animal.nombre);
  }
}
