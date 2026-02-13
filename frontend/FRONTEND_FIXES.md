# Frontend Fixes - Integración con Backend

## Tecnología actual: Ionic Framework

El frontend usa **Ionic** con Angular standalone components. Dado que ya tienes componentes Ionic funcionando, se recomienda mantener esta arquitectura en lugar de cambiar a Angular Material.

---

## 🔰 PROBLEMA 1: Configurar Auth Service

### Archivo: `src/app/services/auth.service.ts`

**Actualizar para que use la API correcta:**
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuarios/login`, { email, password });
  }

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = atob(token.split('.')[1]);
      const decoded = JSON.parse(payload);
      return decoded.rol || null;
    } catch (e) {
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
```

---

## 🔰 PROBLEMA 2: Verificar HttpClientModule

### Archivo: `src/app/app.module.ts` o `src/app/app.config.ts`

**Asegurarse que HttpClientModule esté importado:**
```typescript
import { HttpClientModule } from '@angular/common/http';

// Si usas standalone:
import { provideHttpClient } from '@angular/common/http';

@NgModule({
  imports: [
    HttpClientModule,
    // ... otros imports
  ]
})
export class AppModule { }
```

---

## 🔰 PROBLEMA 3: Mejorar Login Component

### Archivo: `src/app/login/login.page.ts`

**El componente ya existe, pero verificar que importe HttpClientModule:**
```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonItem, IonLabel, IonInput, IonButton, IonCard,
  IonCardContent, IonCardHeader, IonIcon, IonSpinner
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonItem, IonLabel, IonInput, IonButton, IonCard,
    IonCardContent, IonCardHeader, IonIcon, IonSpinner
  ]
})
export class LoginPage {
  email = '';
  password = '';
  loading = false;
  errorMsg = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  login() {
    this.loading = true;
    this.errorMsg = '';
    
    this.authService.login(this.email, this.password).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response.token) {
          this.authService.saveToken(response.token);
          const rol = this.authService.getUserRole();
          
          switch (rol) {
            case 'admin':
              this.router.navigate(['/admin']);
              break;
            case 'veterinario':
              this.router.navigate(['/animales']);
              break;
            case 'recepcionista':
              this.router.navigate(['/citas-recepcionista']);
              break;
            case 'cliente':
              this.router.navigate(['/mis-animales']);
              break;
            default:
              this.errorMsg = 'Rol desconocido';
          }
        } else {
          this.errorMsg = 'Respuesta inesperada del servidor.';
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMsg = error.error?.error || error.error?.message || 'Error de conexión';
        console.error('Login error:', error);
      }
    });
  }
}
```

---

## 🔰 PROBLEMA 4: Crear componente Receptionist Dashboard

### Generar componente:
```bash
cd frontend
ng generate component pages/citas-recepcionista
```

### Archivo: `src/app/pages/citas-recepcionista/citas-recepcionista.page.ts`

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonButton, IonList, IonItem, IonLabel
} from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-citas-recepcionista',
  templateUrl: './citas-recepcionista.page.html',
  styleUrls: ['./citas-recepcionista.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonButton, IonList, IonItem, IonLabel
  ]
})
export class CitasRecepcionistaPage implements OnInit {
  citas: any[] = [];
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCitas();
  }

  loadCitas() {
    this.loading = true;
    // Cargar citas desde API
    // this.citasService.getCitas().subscribe(...)
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
```

---

## ✅ Pasos a ejecutar en orden:

### 1. **En VSCode - Terminal del frontend:**
   ```bash
   cd frontend
   npm install
   ```

### 2. **Verificar y actualizar `src/app/services/auth.service.ts`**

### 3. **Verificar HttpClient en módulos/configuración**

### 4. **Crear dashboard receptionist:**
   ```bash
   ng generate component pages/citas-recepcionista
   ```

### 5. **Actualizar rutas si es necesario en `app.routes.ts`**

### 6. **Probar login:**
   ```bash
   ng serve
   ```
   Ir a `http://localhost:4200` y probar con credenciales de recepcionista

---

## 👋 Credenciales de prueba (del backend):

- **Admin**: admin@clinic.com / admin123
- **Veterinario**: vet@clinic.com / vet123
- **Recepcionista**: receptionist@clinic.com / receptionist123
- **Cliente**: client@clinic.com / client123

(Ajusta según lo que hayas creado en la base de datos)

---

## 🔠 Endpoint consumido:

- `POST /api/usuarios/login` - Login de usuarios
- `GET /api/citas` - Obtener citas (a implementar)
- `POST /api/citas` - Crear cita (a implementar)
- `GET /api/citas/:id` - Obtener cita por ID (a implementar)

