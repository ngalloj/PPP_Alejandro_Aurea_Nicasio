// frontend/src/app/pages/login/login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from 'src/app/services/auth.service';
import { BRANDING } from 'src/app/shared/sidenav/branding';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, MatCardModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  branding = BRANDING;
  loginForm: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder, 
    private auth: AuthService, 
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get emailField() { return this.loginForm.get('email'); }
  get passwordField() { return this.loginForm.get('password'); }

  onSubmit() {
    this.error = null;
    
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    
    this.loading = true;
    const { email, password } = this.loginForm.value;
    
    this.auth.login(email, password).subscribe({
      next: (res) => {
        console.log('✅ Respuesta del backend:', res);
        
        this.auth.saveToken(res.token);
        this.auth.saveUsuario(res.usuario);
        
        this.loading = false;
        
        const rol = this.auth.getRole();
        console.log('👤 Rol detectado:', rol);
        
        switch (rol) {
          case 'admin':
            console.log('🔄 Redirigiendo a /admin');
            this.router.navigate(['/admin']);
            break;
          case 'veterinario':
            console.log('🔄 Redirigiendo a /animales');
            this.router.navigate(['/animales']);
            break;
          case 'recepcionista':
            console.log('🔄 Redirigiendo a /citas-clientes');
            this.router.navigate(['/citas-clientes']);
            break;
          case 'cliente':
            console.log('🔄 Redirigiendo a /mis-animales');
            this.router.navigate(['/mis-animales']);
            break;
          default:
            console.error('❌ Rol desconocido:', rol);
            this.error = 'Rol de usuario no reconocido';
            this.router.navigate(['/login']);
        }
      },
      error: (err) => {
        console.error('❌ Error en login:', err);
        this.error = err.error?.error || 'Correo o contraseña incorrectos';
        this.loading = false;
      }
    });
  }
}
