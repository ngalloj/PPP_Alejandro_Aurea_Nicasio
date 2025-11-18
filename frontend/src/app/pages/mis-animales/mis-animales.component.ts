import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { AnimalService } from '../../services/animal.service';

@Component({
  selector: 'app-mis-animales',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule],
  templateUrl: './mis-animales.component.html',
  styleUrls: ['./mis-animales.component.css'],
})
export class MisAnimalesComponent implements OnInit {
  animales: any[] = [];
  displayedColumns = ['nombre', 'especie', 'edad'];

  constructor(private animalService: AnimalService) { }

  ngOnInit() {
    this.animalService.getMisAnimales().subscribe(data => {
      this.animales = data.animales || data;
    });
  }
}
