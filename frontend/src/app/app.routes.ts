// frontend/src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { UsersComponent } from './pages/users/users.component';
import { RoleGuard } from './guards/role.guard';
import { AnimalComponent } from './pages/animal/animal.component';
import { MisAnimalesComponent } from './pages/mis-animales/mis-animales.component';
import { ClientesCitasComponent } from './pages/clientes-citas/clientes-citas.component';
import { AuthGuard } from './guards/auth.guard';
import { UserCreateComponent } from './pages/user-create/user-create.component';
import { MisCitasComponent } from './components/mis-citas/mis-citas.component';

// Rutas de la aplicación
export const routes: Routes = [
  // Públicas
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Protegidas por roles
  { path: 'admin', component: AdminDashboardComponent, canActivate: [RoleGuard], data: { roles: ['admin'] } },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['admin', 'veterinario'] } },
  { path: 'animal', component: AnimalComponent, canActivate: [RoleGuard], data: { roles: ['veterinario', 'admin'] } },
  { path: 'animales', component: AnimalComponent, canActivate: [RoleGuard], data: { roles: ['veterinario', 'admin'] } },
  { path: 'mis-animales', component: MisAnimalesComponent, canActivate: [RoleGuard], data: { roles: ['cliente'] } },
  { path: 'citas-clientes', component: ClientesCitasComponent, canActivate: [RoleGuard], data: { roles: ['recepcionista', 'admin', 'veterinario'] } },
  { path: 'mis-citas', component: MisCitasComponent, canActivate: [AuthGuard], data: { roles: ['cliente']}},
  
  // Crear usuario / Solo admin y veterinario
  { 
    path: 'crear-usuario', 
    component: UserCreateComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'veterinario', 'recepcionista'] }
  },

  // Rutas por defecto o error
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
