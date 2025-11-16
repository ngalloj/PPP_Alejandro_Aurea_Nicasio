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
    IonLabel
  ]
})
export class UsersPage implements OnInit {
  users = [
    { nombre: "Pepe Perez", email: "pepe@correo.com" },
    { nombre: "Ana Ruiz", email: "ana@correo.com" }
  ];

  // constructor(private userService: UserService) { }

  ngOnInit() {
    // Si tienes un servicio, carga los usuarios aquí:
    // this.userService.getUsers().subscribe(users => { this.users = users });
  }
}
