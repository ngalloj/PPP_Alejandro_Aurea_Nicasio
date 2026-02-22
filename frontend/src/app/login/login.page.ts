import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, LoginResponse } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  email = '';
  password = '';
  loading = false;
  errorMsg = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  login() {
    this.loading = true;
    this.errorMsg = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (response: LoginResponse) => {
        this.loading = false;

        // login() ya llama a saveSession(response) en el propio servicio,
        // así que aquí solo comprobamos que haya token y navegamos.
        if (response?.token) {
          this.router.navigate(['/menu']);
        } else {
          this.errorMsg = 'Respuesta inesperada del servidor.';
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMsg =
          error.error?.message || 'Credenciales incorrectas o error de red.';
      },
    });
  }
}
