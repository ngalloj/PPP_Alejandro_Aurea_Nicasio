// frontend/src/app/pages/clientes-citas/clientes-citas.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { CitaService } from '../../services/cita.service';
import { MatFormFieldModule } from '@angular/material/form-field';


@Component({
  selector: 'app-clientes-citas',
  standalone: true,
  imports: [MatFormFieldModule, CommonModule, ReactiveFormsModule, FormsModule, MatCardModule, MatTableModule, MatButtonModule],
  templateUrl: './clientes-citas.component.html',
  styleUrls: ['./clientes-citas.component.css']
})
export class ClientesCitasComponent implements OnInit {
  citas: any[] = [];
  displayedColumns = ['cliente', 'animal', 'fecha', 'accion'];
  citaForm: FormGroup;

  constructor(private citaService: CitaService, private fb: FormBuilder) { // FormBuilder añadido
    this.citaForm = this.fb.group({
      cliente: ['', Validators.required],
      animal: ['', Validators.required],
      fecha: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.cargarCitas();
  }

  cargarCitas() {
    this.citaService.getCitas().subscribe(data => {
      this.citas = data.citas || data;
    });
  }

  crearCita() {
    if (this.citaForm.valid) {
      this.citaService.crearCita(this.citaForm.value).subscribe({
        next: () => {
          alert('¡Cita guardada!');
          this.citaForm.reset();
          this.cargarCitas();
        },
        error: () => alert('Error al guardar la cita')
      });
    }
  }

  verCliente(cliente: any) {
    alert('Abrir cliente: ' + cliente.nombre);
  }
}
