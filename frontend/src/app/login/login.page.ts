import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonInput,
  IonButton
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonItem,
    IonLabel,
    IonInput,
    IonButton
  ]
})
export class LoginPage {
  email = '';
  password = '';
  constructor(private router: Router) {}
  login() {
    // Simulación login (¡pon tu lógica real aquí!)
    if (this.email && this.password) {
      this.router.navigate(['/users']);
    } else {
      alert("Introduce email y contraseña");
    }
  }
}
