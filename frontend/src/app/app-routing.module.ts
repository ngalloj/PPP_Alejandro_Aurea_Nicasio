import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Importa tu guard y los componentes de las páginas
import { AdminGuard } from './guards/admin.guard';
//import { PanelAdminComponent } from './pages/panel-admin/panel-admin.component';
//import { HomeComponent } from './pages/home/home.component';
//import { ForbiddenComponent } from './pages/forbidden/forbidden.component'; // Pon un componente para acceso denegado

const routes: Routes = [
 // { path: 'panel-admin', component: PanelAdminComponent, canActivate: [AdminGuard] }, // solo admin accede
 // { path: 'home', component: HomeComponent },
 // { path: 'forbidden', component: ForbiddenComponent }, // para mostrar acceso denegado
 // { path: '**', redirectTo: 'home' }
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule) },
  { path: 'register', loadChildren: () => import('./register/register.module').then(m => m.RegisterPageModule) },
  { path: 'users', loadChildren: () => import('./users/users.module').then(m => m.UsersPageModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
