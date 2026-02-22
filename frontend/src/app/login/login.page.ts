// src/app/login/login.page.ts
// ----------------------------------------------------------
// Página de login: usa AuthService.login() y navega a /menu
// cuando hay access_token en la respuesta.
// ----------------------------------------------------------

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

  login(): void {
    this.loading = true;
    this.errorMsg = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (response: LoginResponse) => {
        this.loading = false;
        console.log('LOGIN RESPONSE =>', response);

        // El backend devuelve access_token, no token
        if (response?.access_token) {
          this.router.navigate(['/menu']);
        } else {
          this.errorMsg = 'Respuesta inesperada del servidor.';
        }
      },
      error: (error: any) => {
        this.loading = false;
        console.error('LOGIN ERROR =>', error);
        this.errorMsg =
          error?.error?.message || 'Credenciales incorrectas o error de red.';
      },
    });
  }
}
