// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// IMPORTACIÓN DEL LAYOUT (Asegúrate de que la ruta sea esta)
import { LayoutComponent } from './components/layout/layout.component';

// IMPORTACIÓN DE TUS INTERCEPTORES/GUARDS (Si los tienes)
// import { AuthInterceptor } from './interceptors/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent // <--- DECLARACIÓN CRUCIAL PARA EL MENÚ
  ],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    HttpClientModule, // <--- NECESARIO PARA CONECTAR CON EL BACKEND
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // Configuración opcional para tu interceptor de tokens
    /* {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    } */
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
