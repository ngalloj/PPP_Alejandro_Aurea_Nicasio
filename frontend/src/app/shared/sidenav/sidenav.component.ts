import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
  menu = [
    { path: '/users', label: 'Usuarios', icon: 'group' },
    { path: '/register', label: 'Registro', icon: 'person_add' },
    // Agrega más opciones de menú si necesitas
  ];
}
