import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    CommonModule,     // para *ngFor y otras directivas comunes
    RouterModule      // para [routerLink] y router-outlet
  ],
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent {
  constructor (public auth: AuthService) {}

  get isAdmin(): boolean {
    return this.auth.isAdmin();
  }

  menu = [
    { path: '/users', label: 'Usuarios', icon: 'group' },
    { path: '/register', label: 'Registro', icon: 'person_add' },
    // Agrega más opciones de menú si necesitas
  ];

  
}
