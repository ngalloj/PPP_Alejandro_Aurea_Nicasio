import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ProductoService,
  Producto,
  UpdateProductoDto,
  ProductoTipo
} from '../../../services/producto.service';

import { PermisosService } from 'src/app/seguridad/permisos.service';
import { PhotoService } from '../../../services/photo.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-productos',
  templateUrl: './edit-productos.page.html',
  styleUrls: ['./edit-productos.page.scss'],
  standalone: false,
})
export class EditProductosPage {
  loading = false;
  saving = false;
  errorMsg = '';
  okMsg = '';

  editMode = false;

  producto: Producto | null = null;

  tipos: ProductoTipo[] = ['medicamento', 'material', 'alimentacion', 'complementos'];

  form: UpdateProductoDto = {
    nombre: '',
    descripcion: '',
    precio: 0,
    tipo: 'medicamento',
    stock: 0,
    stockMinimo: 0,
    foto: '',
  };

  private idElemento!: number;

  constructor(
    private productoService: ProductoService,
    private route: ActivatedRoute,
    private router: Router,
    private permisos: PermisosService,
    public photoService: PhotoService
  ) {}

  capturedPhoto: string = '';
  originalPhoto: string = '';
  removeImage = false;

  get canVer(): boolean {
    return this.permisos.can('productos', 'ver');
  }

  get canEditar(): boolean {
    return this.permisos.can('productos', 'editar');
  }

  // Solo admin puede editar campos base
  get canEditarCamposBase(): boolean {
    return this.permisos.role() === 'administrador';
  }

  ionViewWillEnter() {
    if (!this.canVer) {
      this.router.navigate(['/menu']);
      return;
    }

    const id = this.route.snapshot.paramMap.get('id');
    this.idElemento = Number(id);

    if (!this.idElemento) {
      this.errorMsg = 'ID de producto inválido.';
      return;
    }

    this.cargarProducto();
  }

  cargarProducto() {
    this.loading = true;
    this.errorMsg = '';
    this.okMsg = '';

    this.productoService.getProductoById(this.idElemento).subscribe({
      next: (data) => {
        this.producto = data;
        this.precargarFormDesdeProducto(data);
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Error cargando producto.';
      }
    });
  }

  activarEdicion() {
    if (!this.producto) return;
    if (!this.canEditar) return;

    this.editMode = true;
    this.okMsg = '';
    this.errorMsg = '';
    this.precargarFormDesdeProducto(this.producto);
  }

  cancelarEdicion() {
    this.editMode = false;
    this.okMsg = '';
    this.errorMsg = '';
    if (this.producto) this.precargarFormDesdeProducto(this.producto);
  }

  async guardarCambios() {
    if (!this.producto) return;
    if (!this.canEditar) return;

    this.saving = true;
    this.errorMsg = '';
    this.okMsg = '';

    let blob: Blob | null = null;
    let payload: UpdateProductoDto;

    if (this.canEditarCamposBase) {
      payload = {
        nombre: (this.form.nombre || '').trim() || undefined,
        descripcion: (this.form.descripcion || '').trim() || undefined,
        precio:
          this.form.precio !== null && this.form.precio !== undefined
            ? Number(this.form.precio)
            : undefined,
        tipo: this.form.tipo || undefined,
        stock:
          this.form.stock !== null && this.form.stock !== undefined
            ? Number(this.form.stock)
            : undefined,
        stockMinimo:
          this.form.stockMinimo !== null && this.form.stockMinimo !== undefined
            ? Number(this.form.stockMinimo)
            : undefined,
      };
      (payload as any).removeImage = this.removeImage;
    } else {
      payload = {
        stock:
          this.form.stock !== null && this.form.stock !== undefined
            ? Number(this.form.stock)
            : undefined,
      };
      (payload as any).removeImage = this.removeImage;
    }

    if (!this.removeImage && this.capturedPhoto && this.capturedPhoto !== this.originalPhoto) {
      const response = await fetch(this.capturedPhoto);
      blob = await response.blob();
    }

    // limpiar undefined/'' para enviar lo mínimo
    Object.keys(payload).forEach((k) => {
      const key = k as keyof UpdateProductoDto;
      if ((payload as any)[key] === undefined || (payload as any)[key] === '') {
        delete (payload as any)[key];
      }
    });

    this.productoService.updateProducto(this.idElemento, payload, blob ?? undefined).subscribe({
      next: () => {
        this.saving = false;
        this.okMsg = 'Producto actualizado correctamente.';
        this.editMode = false;
        this.cargarProducto();
      },
      error: (err) => {
        this.saving = false;
        this.errorMsg = err?.error?.message || 'Error guardando cambios.';
      }
    });
  }

  volver() {
    this.router.navigate(['/list-productos']);
  }

  private precargarFormDesdeProducto(p: Producto) {
    const el = (p as any).Elemento || (p as any).elemento || null;

    this.form = {
      nombre: el?.nombre ?? '',
      descripcion: el?.descripcion ?? '',
      precio: el?.precio ?? 0,
      tipo: p.tipo ?? 'medicamento',
      stock: p.stock ?? 0,
      stockMinimo: p.stockMinimo ?? 0,
    };

    const baseBackend = environment.apiUrl.replace('/api', '');

    if (p.foto) {
      const url = `${baseBackend}/images/${p.foto}`;
      this.originalPhoto = url;
      this.capturedPhoto = url;
    } else {
      this.originalPhoto = '';
      this.capturedPhoto = '';
    }
    this.removeImage = false;
  }

  // ========= FOTO =========

  takePhoto() {
    this.photoService.takePhoto().then(data => {
      this.capturedPhoto = data.webPath ? data.webPath : '';
      this.removeImage = false;
    });
  }

  pickImage() {
    this.photoService.pickImage().then(data => {
      this.capturedPhoto = data.webPath;
      this.removeImage = false;
    });
  }

  discardImage() {
    this.capturedPhoto = '';
    this.removeImage = true;
  }
}
