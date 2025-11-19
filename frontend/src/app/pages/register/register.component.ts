// frontend/src/app/pages/register/register.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private userService: UserService) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      password2: ['', [Validators.required]]
    }, { validators: [this.passwordsMatch] });
  }

  get emailField() { return this.registerForm.get('email'); }
  get passwordField() { return this.registerForm.get('password'); }
  get password2Field() { return this.registerForm.get('password2'); }

  passwordsMatch(group: AbstractControl) {
    const pass = group.get('password')?.value;
    const pass2 = group.get('password2')?.value;
    return pass === pass2 ? null : { notMatching: true };
  }

  onSubmit() {
    this.error = null;
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    const { email, password } = this.registerForm.value;
    this.userService.create({ email, password }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['login']); // O la ruta de tu login real
      },
      error: (err) => {
        this.error = 'No se pudo registrar.';
        this.loading = false;
      },
    });
  }
}