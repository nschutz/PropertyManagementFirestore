import { Component, Input, Inject } from '@angular/core';
import { ReportService, Report } from '../core/report.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';


@Component({
  selector: '[report-detail]',
  templateUrl: './report-detail.component.html',
})
export class ReportDetailComponent {

  @Input()
  report: Report;

  constructor(private reportService: ReportService, public afs: AngularFirestore, public storage: AngularFireStorage, public dialog: MatDialog ) {
  }
  downloadURL: Observable<string | null>;
  reportCompleted(event: any) {
    this.afs.collection("reports").doc(this.report.id).update({ completed: true });
  }

  viewPhoto(event: any) {
    this.downloadURL = this.storage.ref(this.report.photoUrl).getDownloadURL();
    const dialogRef = this.dialog.open(ReportDetailModule, {
      data: { downloadUrl: this.downloadURL, report: this.report }
    });

  }

}

@Component({
  selector: 'report-detail-module',
  templateUrl: './report-detail-module.component.html',
})
export class ReportDetailModule {
  constructor( @Inject(MAT_DIALOG_DATA) public data: any) { }
}
