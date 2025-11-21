// frontend/src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { SidenavComponent } from './shared/sidenav/sidenav.component';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { AuthService } from './services/auth.service'; // Asegúrate de la ruta correcta
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    RouterModule, 
    SidenavComponent,
    IonApp,
    IonRouterOutlet,
    SidenavComponent
  ],
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  usuarioLogueado: any = null;

  ngOnInit() {
    this.usuarioLogueado = this.authService.getUserFromToken();
    console.log('Usuario logueado:', this.usuarioLogueado);

    // Ejemplo: uso del rol para lógica de UI (según quieras en el template)
    if (this.usuarioLogueado) {
      console.log('El rol del usuario es:', this.usuarioLogueado.rol);
      // Aquí puedes decidir mostrar menú/ruta según el rol
    }
  }
  
  logout() {
    // tu lógica real (ejemplo)
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}