// guards/role.guard.ts
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRouteSnapshot, Router, CanActivate } from '@angular/router';


@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles = route.data['roles'] as string[];
    if (this.auth.isLoggedIn() && expectedRoles.includes(this.auth.getRole())) {
      return true;
    }
    this.router.navigate(['/forbidden']);
    return false;
  }
  
}
