import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AuthService } from '../core/auth.service';
import { AngularFireAuth } from 'angularfire2/auth';

import { Observable } from 'rxjs/Observable';


export class newReport {
  uid: string;
  description: string;
  location: string;
  photoUrl: string;
  time: Date;
  completed: boolean;
}

export class Report {
  id: string;
  uid: string;
  description: string;
  location: string;
  photoUrl: string;
  time: Date;
  completed: boolean;
}


@Injectable()
export class ReportService {

  reports: Observable<Report[]> = null;
  allReports: Observable<Report[]> = null;

  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth, private router: Router, public auth: AuthService) {
    if (auth.canReadAll) {
      this.getIncompleteReports();
    }
    this.reports = this.afAuth.authState
      .switchMap(user => {
        if (user) {
          return this.afs.collection("reports", ref => ref.where('uid', '==', `${user.uid}`).orderBy('time', 'desc')).valueChanges()
        } else {
          return Observable.of(null)
        }
      });
  }

  createReport(report: newReport) {
    this.afs.collection('reports').add(report);
    this.router.navigate(['/home']);
  }

  getAllReports() {
    this.allReports = this.afs.collection("reports", ref => ref.orderBy('time', 'desc')).snapshotChanges().map((actions) => {
      return actions.map((a) => {
        const data = a.payload.doc.data() as Report;
        return {
          id: a.payload.doc.id, uid: data.uid, description: data.description, location: data.location, photoUrl: data.photoUrl, time: data.time, completed: data.completed
        };
      });
    });
  }

  getIncompleteReports() {
    this.allReports = this.afs.collection("reports", ref => ref.where('completed', '==', false).orderBy('time', 'desc')).snapshotChanges().map((actions) => {
      return actions.map((a) => {
        const data = a.payload.doc.data() as Report;
        return {
          id: a.payload.doc.id, uid: data.uid, description: data.description, location: data.location, photoUrl: data.photoUrl, time: data.time, completed: data.completed
        };
      });
    });
  }

  getCompleteReports() {
    this.allReports = this.afs.collection("reports", ref => ref.where('completed', '==', true).orderBy('time', 'desc')).snapshotChanges().map((actions) => {
      return actions.map((a) => {
        const data = a.payload.doc.data() as Report;
        return {
          id: a.payload.doc.id, uid: data.uid, description: data.description, location: data.location, photoUrl: data.photoUrl, time: data.time, completed: data.completed
        };
      });
    });
  }

  filterReports(value: string) {
    this.allReports = this.afAuth.authState
      .switchMap(user => {
        if (user) {
          return this.afs.collection('reports', ref => ref.where('description', '==', value)).valueChanges();
        } else {
          return Observable.of(null)
        }
      });
  }
}
