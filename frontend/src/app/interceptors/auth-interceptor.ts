// frontend/src/app/interceptors/auth-interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('El interceptor se está ejecutando');
    // EXCLUIR LOGIN: Si la URL contiene /usuario/login, no añadir token
    if (req.url.endsWith('/usuario/login')) {
      console.log('Petición de LOGIN detectada, excluyendo token y headers.');
      return next.handle(req);
    }
    
    console.log('El interceptor se está ejecutando para:', req.url);
    const token = this.auth.getToken();
    console.log('TOKEN en interceptor:', token);

    if (token) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      return next.handle(authReq);
    }
    return next.handle(req);
  }
}
