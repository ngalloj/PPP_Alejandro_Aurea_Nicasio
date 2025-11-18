import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { CitaService } from '../../services/cita.service'; // Asegúrate de tenerlo

@Component({
  selector: 'app-clientes-citas',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatButtonModule],
  templateUrl: './clientes-citas.component.html',
  styleUrls: ['./clientes-citas.component.css']
})
export class ClientesCitasComponent implements OnInit {
  citas: any[] = [];
  displayedColumns = ['cliente', 'animal', 'fecha', 'accion'];

  constructor(private citaService: CitaService) {}

  ngOnInit() {
    this.citaService.getCitas().subscribe(data => {
      this.citas = data.citas || data;
    });
  }

  verCliente(cliente: any) {
    alert('Abrir cliente: ' + cliente.nombre);
  }
}
