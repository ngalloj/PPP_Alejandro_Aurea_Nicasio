import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterModule, IonicModule],
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent {
  user = this.auth.getUserFromToken();

  constructor(private auth: AuthService) {}

  logout() {
    this.auth.logout();
    location.href = '/login';
  }

  get role(): string | null {
    return this.user?.rol ?? null;
  }

  canSee(roles: string[]) {
    return this.role ? roles.includes(this.role) : false;
  }
}
