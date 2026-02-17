// frontend/src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { ShellComponent } from './components/shell/shell.component';

// tus páginas actuales
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AnimalComponent } from './pages/animal/animal.component';
import { MisAnimalesComponent } from './pages/mis-animales/mis-animales.component';
import { ClientesCitasComponent } from './pages/clientes-citas/clientes-citas.component';
import { UserCreateComponent } from './pages/user-create/user-create.component';
import { MisCitasComponent } from './components/mis-citas/mis-citas.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: ShellComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: AdminDashboardComponent }, // o crea un Dashboard común
      { path: 'admin', component: AdminDashboardComponent },
      { path: 'animales', component: AnimalComponent },
      { path: 'mis-animales', component: MisAnimalesComponent },
      { path: 'citas-clientes', component: ClientesCitasComponent },
      { path: 'mis-citas', component: MisCitasComponent },
      { path: 'crear-usuario', component: UserCreateComponent },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  { path: '**', redirectTo: '/login' },
];
