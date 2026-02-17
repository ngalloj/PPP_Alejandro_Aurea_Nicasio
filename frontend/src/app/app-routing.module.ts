import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component'; // Asegúrate de que la ruta es correcta
import { AuthGuard } from './guards/auth.guard'; // Tu guard de seguridad

const routes: Routes = [
  // Ruta de Login (Sin menú lateral)
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  
  // Rutas con Menú Lateral (Hijas del Layout)
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard], // Solo entran si están logueados
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardPageModule)
      },
      {
        path: 'mascotas',
        loadChildren: () => import('./mascotas/mascotas.module').then(m => m.MascotasPageModule)
      },
      {
        path: 'citas',
        loadChildren: () => import('./citas/citas.module').then(m => m.CitasPageModule)
      },
      // Ruta por defecto dentro del layout
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },

  // Redirección inicial
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  
  // 404 - Cualquier otra ruta va al login o dashboard
  {
    path: '**',
    redirectTo: 'login'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
