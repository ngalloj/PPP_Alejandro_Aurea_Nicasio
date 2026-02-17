// frontend/src/app/pages/admin-dashboard/admin-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,           // ✅ AÑADIDO para *ngIf y pipes
    MatCardModule, 
    MatButtonModule, 
    RouterModule,
    IonicModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  usuarioLogueado: any = null;  // ✅ AÑADIDA la propiedad

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Obtener usuario desde el token o localStorage
    this.usuarioLogueado = this.authService.getUsuario();
    
    // Si no está en localStorage, intenta desde el token
    if (!this.usuarioLogueado) {
      this.usuarioLogueado = this.authService.getUserFromToken();
    }
    
    console.log('Usuario en AdminDashboard:', this.usuarioLogueado);
  }
}
