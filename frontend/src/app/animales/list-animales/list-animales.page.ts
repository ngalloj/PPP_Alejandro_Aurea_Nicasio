// src/app/animales/list-animales/list-animales.page.ts
// ----------------------------------------------------------
// Lista de animales.
// - Usa AnimalService para cargar.
// - Filtra por propietario si el rol es cliente.
// - Genera URL de foto con environment (Render en prod).
// ----------------------------------------------------------

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Animal, AnimalService } from '../../services/animal.service';
import { PermisosService } from 'src/app/seguridad/permisos.service';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-list-animales',
  templateUrl: './list-animales.page.html',
  styleUrls: ['./list-animales.page.scss'],
  standalone: false,
})
export class ListAnimalesPage {

  animales: Animal[] = [];
  loading = false;
  errorMsg = '';

  constructor(
    private animalService: AnimalService,
    private router: Router,
    private permisos: PermisosService,
    private auth: AuthService
  ) {}

  // ========= PERMISOS / ROL =========

  get isCliente(): boolean {
    return (this.auth.getUserRole() || '') === 'cliente';
  }

  get idUsuarioLogueado(): number {
    return Number(this.auth.getUser()?.idUsuario ?? 0);
  }

  // ========= CICLO DE VIDA =========

  ionViewWillEnter(): void {
    this.cargarAnimales();
  }

  // Llamado tanto al entrar como desde el ion-refresher
  cargarAnimales(): void {
    this.loading = true;
    this.errorMsg = '';

    this.animalService.getAnimales().subscribe({
      next: (data) => {
        const todos = data ?? [];
        this.animales = this.isCliente
          ? todos.filter(a => Number(a.idUsuario) === this.idUsuarioLogueado)
          : todos;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Error cargando animales.';
      }
    });
  }

  // ========= NAVEGACIÓN =========
  // La plantilla te pasa el animal completo: (click)="verDetalle(a)"
  verDetalle(a: Animal): void {
    this.router.navigate(['/edit-animales', a.idAnimal]);
  }

  // ========= URL DE FOTO =========
  getAnimalFotoUrl(a: Animal): string {
    if (!a.foto) {
      return 'assets/No-Image-Placeholder.svg';
    }
    const baseBackend = environment.apiUrl.replace('/api', '');
    return `${baseBackend}/images/${a.foto}`;
  }
}
