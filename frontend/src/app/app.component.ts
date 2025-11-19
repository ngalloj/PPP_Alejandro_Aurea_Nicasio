// frontend/src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { SidenavComponent } from './shared/sidenav/sidenav.component';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { AuthService } from './services/auth.service'; // Asegúrate de la ruta correcta

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonApp, IonRouterOutlet,SidenavComponent],
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.css']  
})
export class AppComponent implements OnInit {
  usuarioLogueado: any = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.usuarioLogueado = this.authService.getUserFromToken();
    console.log('Usuario logueado:', this.usuarioLogueado);

    // Ejemplo: uso del rol para lógica de UI (según quieras en el template)
    if (this.usuarioLogueado) {
      console.log('El rol del usuario es:', this.usuarioLogueado.rol);
      // Aquí puedes decidir mostrar menú/ruta según el rol
    }
  }
}