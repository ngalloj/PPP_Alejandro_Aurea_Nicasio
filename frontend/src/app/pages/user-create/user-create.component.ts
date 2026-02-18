// frontend/src/app/pages/user-create/user-create.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent {
  email = '';
  password = '';
  dni = '';
  rol = '';
  mensaje = '';
  rolesPosibles = ['admin', 'veterinario', 'recepcionista', 'cliente'];

  constructor(
    private http: HttpClient,
    private router: Router,
    public auth: AuthService
  ) {}

  ngOnInit() {
    // Si el logueado es recepcionista, sólo permitir "cliente"
    const miRol = this.auth.getRole();
    if (miRol === 'recepcionista') {
      this.rolesPosibles = ['cliente'];
      this.rol = 'cliente'; // Valor por defecto
    }
  }

  crearUsuario() {
    // Si recepcionista, fuerza rol a cliente por seguridad extra
    let rolToSend = this.rol;
    if (this.auth.getRole() === 'recepcionista') rolToSend = 'cliente';

    // IMPORTANTE: Añadimos dni al objeto enviado
    this.http.post('http://localhost:3000/api/usuario', {
      email: this.email,
      password: this.password,
      rol: rolToSend,
      dni: this.dni
    }).subscribe({
      next: res => {
        this.mensaje = 'Usuario creado con éxito';
        this.email = this.password = this.dni = this.rol = '';
        if (this.auth.getRole() === 'recepcionista') this.rol = 'cliente';
      },
      error: err => {
        this.mensaje = 'Error: ' + (err.error?.error || err.message);
      }
    });
  }

  puedeCrear(): boolean {
    const role = this.auth.getRole();
    return role === 'admin' || role === 'veterinario' || role === 'recepcionista';
  }
}
