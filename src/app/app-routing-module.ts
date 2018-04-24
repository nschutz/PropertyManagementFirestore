import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserLoginComponent } from './user-login/user-login.component';
import { UserHomeComponent } from './user-home/user-home.component';
import { UserRegisterComponent } from './user-register/user-register.component';
import { UserReportComponent } from './user-report/user-report.component';

import { AuthGuard } from './core/auth.guard';
import { CoreModule } from './core/core.module';

const routes: Routes = [
  { path: '', component: UserLoginComponent },
  { path: 'login', component: UserLoginComponent },
  { path: 'register', component: UserRegisterComponent },
  { path: 'home', component: UserHomeComponent, canActivate: [AuthGuard] },
  { path: 'report', component: UserReportComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule { }
