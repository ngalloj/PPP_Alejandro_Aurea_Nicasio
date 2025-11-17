import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    this.loading = true;
    this.error = null;
    if (this.loginForm.invalid) {
      this.loading = false;
      return;
    }
    // Aquí iría el llamado real al servicio de login
    setTimeout(() => {
      this.loading = false;
      this.error = 'Usuario o contraseña incorrectos';
    }, 1000);
  }
}
