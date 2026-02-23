// src/app/animales/list-animales/list-animales.page.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Animal, AnimalService } from 'src/app/services/animal.service';
import { Usuario, UsuarioService } from 'src/app/services/usuario.service';

import { PermisosService } from 'src/app/seguridad/permisos.service';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-list-animales',
  templateUrl: './list-animales.page.html',
  styleUrls: ['./list-animales.page.scss'],
  standalone: false,
})
export class ListAnimalesPage {

  animales: Animal[] = [];
  animalesFiltrados: Animal[] = [];

  ownerNameById: Record<number, string> = {};

  filtroEspecie: string = 'todas';
  filtroTexto: string = '';

  loading = false;
  errorMsg = '';

  constructor(
    private animalService: AnimalService,
    private usuarioService: UsuarioService,
    private router: Router,
    private permisos: PermisosService,
    private auth: AuthService
  ) {}

  get canVer(): boolean {
    if (this.isCliente) {
      return this.permisos.can('animales', 'ver', { esPropietario: true });
    }
    return this.permisos.can('animales', 'ver');
  }

  get canNuevo(): boolean {
    return this.permisos.can('animales', 'nuevo');
  }

  get canEliminar(): boolean {
    return this.permisos.can('animales', 'eliminar');
  }

  get isCliente(): boolean {
    return (this.auth.getUserRole() || '') === 'cliente';
  }

  get idUsuarioLogueado(): number {
    return Number(this.auth.getUser()?.idUsuario ?? 0);
  }

  ionViewWillEnter(): void {
    if (!this.canVer) {
      this.router.navigate(['/menu']);
      return;
    }
    if (this.isCliente && !this.idUsuarioLogueado) {
      this.router.navigate(['/menu']);
      return;
    }

    this.cargarDatos();
  }

  private cargarDatos(): void {
    this.loading = true;
    this.errorMsg = '';

    this.usuarioService.getUsuarios().subscribe({
      next: (usuarios: Usuario[]) => {
        this.ownerNameById = this.buildOwnerMap(usuarios || []);

        this.animalService.getAnimales().subscribe({
          next: (animales: Animal[]) => {
            const all = (animales || []);
            this.animales = this.isCliente
              ? all.filter((a: Animal) => Number(a.idUsuario) === this.idUsuarioLogueado)
              : all;

            this.aplicarFiltros();
            this.loading = false;
          },
          error: (err: any) => {
            this.loading = false;
            this.errorMsg = err?.error?.message || 'Error cargando animales';
          }
        });
      },
      error: (err: any) => {
        this.ownerNameById = {};
        this.animalService.getAnimales().subscribe({
          next: (animales: Animal[]) => {
            const all = (animales || []);
            this.animales = this.isCliente
              ? all.filter((a: Animal) => Number(a.idUsuario) === this.idUsuarioLogueado)
              : all;

            this.aplicarFiltros();
            this.loading = false;
            this.errorMsg =
              err?.error?.message ||
              'Aviso: no se pudieron cargar los propietarios (se listan animales igualmente).';
          },
          error: (err2: any) => {
            this.loading = false;
            this.errorMsg = err2?.error?.message || 'Error cargando animales';
          }
        });
      }
    });
  }

  private buildOwnerMap(usuarios: Usuario[]): Record<number, string> {
    const map: Record<number, string> = {};
    for (const u of usuarios) {
      const fullName = `${u.nombre ?? ''} ${u.apellidos ?? ''}${u.nif ? ' (' + u.nif + ')' : ''}`.trim();
      map[u.idUsuario] = fullName || u.email || `Usuario ${u.idUsuario}`;
    }
    return map;
  }

  getOwnerName(idUsuario: number): string {
    return this.ownerNameById[idUsuario] || `Usuario ${idUsuario}`;
  }

  get especiesDisponibles(): string[] {
    const set = new Set<string>();
    for (const a of this.animales) {
      if (a.especie) set.add(a.especie);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }

  aplicarFiltros(): void {
    const txt = this.filtroTexto.toLowerCase().trim();

    this.animalesFiltrados = this.animales.filter((a: Animal) => {
      const coincideEspecie =
        this.filtroEspecie === 'todas' ? true : (a.especie === this.filtroEspecie);

      const ownerName = this.getOwnerName(a.idUsuario).toLowerCase();
      const textoAnimal = `${a.nombre ?? ''} ${a.raza ?? ''} ${ownerName}`.toLowerCase();

      const coincideTexto = txt === '' ? true : textoAnimal.includes(txt);

      return coincideEspecie && coincideTexto;
    });
  }

  limpiarFiltros(): void {
    this.filtroEspecie = 'todas';
    this.filtroTexto = '';
    this.aplicarFiltros();
  }

  eliminarAnimal(animal: Animal): void {
    if (!this.canEliminar) return;

    if (!confirm(`¿Seguro que quieres eliminar a ${animal.nombre}?`)) return;

    this.animalService.deleteAnimal(animal.idAnimal).subscribe({
      next: () => this.cargarDatos(),
      error: () => alert('Error eliminando animal'),
    });
  }

  verDetalle(animal: Animal): void {
    this.router.navigate(['/edit-animales', animal.idAnimal]);
  }

  crearAnimal(): void {
    this.router.navigate(['/form-animales']);
  }

  volver(): void {
    this.router.navigate(['/menu']);
  }

  // FOTO DEL ANIMAL
  getAnimalFotoUrl(a: Animal): string {
    if (!a?.foto) {
      return 'assets/No-Image-Placeholder.svg';
    }
  
    // Si ya es URL absoluta (Cloudinary, etc.), la devolvemos tal cual
    if (a.foto.startsWith('http://') || a.foto.startsWith('https://')) {
      return a.foto;
    }
  
    // Modo antiguo: backend sirviendo /images/<nombre>
    return `https://ppp-alejandro-aurea-nicasio.onrender.com/images/${a.foto}`;
  }
}
