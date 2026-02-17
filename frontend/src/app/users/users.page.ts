// frontend/src/app/users/users.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel
} from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';


// Si tienes UserService, importa aquí

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonLabel,
    IonicModule
  ]
})
export class UsersPage implements OnInit {
  users = [
    { nombre: "Pepe Perez", email: "pepe@correo.com" },
    { nombre: "Ana Ruiz", email: "ana@correo.com" }
  ];
  authService: any; //puesto porque me daba un error
  router: any;  //puesto porque me daba un error

  // constructor(private userService: UserService) { }

  ngOnInit() {
    // Si tienes un servicio, carga los usuarios aquí:
    // this.userService.getUsers().subscribe(users => { this.users = users });
  }

  goLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
