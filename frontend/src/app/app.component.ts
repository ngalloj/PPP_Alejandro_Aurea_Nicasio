import { Component } from '@angular/core';
import { SidenavComponent } from './shared/sidenav/sidenav.component';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonApp, IonRouterOutlet,SidenavComponent],
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.css']  
})
export class AppComponent {
  constructor() {}
}
