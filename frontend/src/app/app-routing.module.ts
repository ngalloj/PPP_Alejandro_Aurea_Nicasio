// frontend/src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AdminGuard } from './guards/admin.guard';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { UsersComponent } from './pages/users/users.component';
import { ForbiddenComponent } from './pages/forbidden/forbidden.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { SidenavComponent } from './shared/sidenav/sidenav.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },           // pública
  { path: 'register', component: RegisterComponent },     // pública o protegida si sólo logueados
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['admin', 'veterinario'] }}, // solo autenticados
  { path: 'admin', component: AdminDashboardComponent, canActivate: [AuthGuard, AdminGuard] }, // solo admins
  { path: 'forbidden', component: ForbiddenComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), BrowserModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    SidenavComponent, 
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
