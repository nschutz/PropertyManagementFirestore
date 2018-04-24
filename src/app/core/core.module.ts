import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { ReportService } from './report.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [AuthService, ReportService]
})
export class CoreModule { }
