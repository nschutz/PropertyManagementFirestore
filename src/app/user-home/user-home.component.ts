import { Component } from '@angular/core';

import { AuthService } from '../core/auth.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { ReportService, Report } from '../core/report.service';

import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css'],
})
export class UserHomeComponent {

  constructor(private afAuth: AngularFireAuth, public auth: AuthService, private reportServ: ReportService) {
  }

}
