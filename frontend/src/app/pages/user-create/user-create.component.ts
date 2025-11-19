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
  rol = '';
  mensaje = '';
  rolesPosibles = ['admin', 'veterinario', 'recepcionista', 'cliente'];

  constructor(
    private http: HttpClient,
    private router: Router,
    public auth: AuthService
  ) {}

  crearUsuario() {
    this.http.post('http://localhost:3000/api/usuario', {
      email: this.email,
      password: this.password,
      rol: this.rol
    }).subscribe({
      next: res => {
        this.mensaje = 'Usuario creado con éxito';
        this.email = this.password = this.rol = '';
      },
      error: err => {
        this.mensaje = 'Error: ' + (err.error?.error || err.message);
      }
    });
  }

  puedeCrear(): boolean {
    const role = this.auth.getRole();
    return role === 'admin' || role === 'veterinario';
  }
}
