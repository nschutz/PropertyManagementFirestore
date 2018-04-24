import { Component } from '@angular/core';

import { AuthService } from '../core/auth.service';

@Component({
  selector: 'nav-component',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent {

  constructor(public auth: AuthService) { }

  logout() {
    this.auth.signOut();
  }
}
