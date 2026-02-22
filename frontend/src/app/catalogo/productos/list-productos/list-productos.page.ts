// src/app/facturacion/productos/list-productos/list-productos.page.ts
// ----------------------------------------------------------
// Lista de productos.
// - Usa ProductoService para API.
// - Fotos construidas con environment.apiUrl (Render en prod).
// ----------------------------------------------------------

import { Component } from '@angular/core';
import {
  ProductoService,
  Producto
} from '../../../services/producto.service';
import { Router } from '@angular/router';
import { PermisosService } from 'src/app/seguridad/permisos.service';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-list-productos',
  templateUrl: './list-productos.page.html',
  styleUrls: ['./list-productos.page.scss'],
  standalone: false,
})
export class ListProductosPage {

  productos: Producto[] = [];
  loading = false;
  errorMsg = '';

  constructor(
    private productoService: ProductoService,
    private router: Router,
    private permisos: PermisosService
  ) {}

  get canVer(): boolean {
    return this.permisos.can('productos', 'ver');
  }

  ionViewWillEnter() {
    if (!this.canVer) {
      this.router.navigate(['/menu']);
      return;
    }
    this.cargarProductos();
  }

  cargarProductos() {
    this.loading = true;
    this.errorMsg = '';

    this.productoService.getProductos().subscribe({
      next: (data) => {
        this.productos = data ?? [];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Error cargando productos.';
      }
    });
  }

  verDetalle(idElemento: number) {
    this.router.navigate(['/edit-productos', idElemento]);
  }

  // ========= URL DE FOTO =========
  // Devuelve la URL completa de la foto del producto.
  getProductoFotoUrl(p: Producto): string {
    if (!p.foto) {
      return 'assets/No-Image-Placeholder.svg';
    }
    const baseBackend = environment.apiUrl.replace('/api', '');
    return `${baseBackend}/images/${p.foto}`;
  }
}
