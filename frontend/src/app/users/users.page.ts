import { Component } from '@angular/core';
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
export class UsersPage {
  users = [
    { nombre: "Pepe Perez", email: "pepe@correo.com" },
    { nombre: "Ana Ruiz", email: "ana@correo.com" }
  ];
}
