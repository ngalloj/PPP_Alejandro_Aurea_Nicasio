/// frontend/src/app/shared/sidenav/sidenav.component.ts
import { Component, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  usuarioLogueado: any = null;

  constructor(public auth: AuthService, private router: Router) { }


  ngOnInit() {
    this.updateUsuario();

    // Escucha cambios de navegación y actualiza usuarioLogueado
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateUsuario();
      }
    });

  }

  updateUsuario() {
    this.usuarioLogueado = this.auth.getUserFromToken();
  }

  // Método logout
  logout() {
    this.auth.logout();
    this.usuarioLogueado = null;
    this.router.navigate(['/login']);
  }

  /** Atajos para roles */
  get isAdmin(): boolean {
    return this.usuarioLogueado?.rol === 'admin';
  }
  get isVeterinario(): boolean {
    return this.usuarioLogueado?.rol === 'veterinario';
  }
  get isRecepcionista(): boolean {
    return this.usuarioLogueado?.rol === 'recepcionista';
  }
  get isCliente(): boolean {
    return this.usuarioLogueado?.rol === 'cliente';
  }

  
}
