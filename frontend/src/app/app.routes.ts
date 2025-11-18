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
// Lo mismo con cualquier otro componente usado


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Ejemplo de rutas protegidas por roles específicos:
  { path: 'admin', component: AdminDashboardComponent, canActivate: [RoleGuard], data: { roles: ['admin'] }},
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['admin', 'veterinario'] }},


  // Veterinario
  { path: 'animal', component: AnimalComponent, canActivate: [RoleGuard], data: { roles: ['veterinario','admin'] }},
  // etc...

  // Cliente
  { path: 'mis-animales', component: MisAnimalesComponent, canActivate: [RoleGuard], data: { roles: ['cliente'] }},

  { path: 'animales', component: AnimalComponent, canActivate: [RoleGuard], data: { roles: ['veterinario', 'admin'] }},
  { path: 'mis-animales', component: MisAnimalesComponent, canActivate: [RoleGuard], data: { roles: ['cliente'] }},
  { path: 'citas-clientes', component: ClientesCitasComponent, canActivate: [RoleGuard], data: { roles: ['recepcionista', 'admin', 'veterinario'] }},

  // Público/genérico
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
