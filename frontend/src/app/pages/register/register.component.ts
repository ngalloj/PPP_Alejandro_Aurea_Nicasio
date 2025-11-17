import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      password2: ['', Validators.required]
    });
  }

  onSubmit() {
    this.loading = true;
    this.error = null;
    if (this.registerForm.invalid ||
      this.registerForm.value.password !== this.registerForm.value.password2) {
      this.loading = false;
      this.error = 'Revisa los datos';
      return;
    }
    // Simula registro
    setTimeout(() => {
      this.loading = false;
      this.error = null; // o mensaje de éxito real
    }, 1000);
  }
}
