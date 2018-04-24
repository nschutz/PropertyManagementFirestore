import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Roles, User } from './user';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap'


@Injectable()
export class AuthService {

  user: Observable<User | null>;

  constructor(private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router) {

    //// Get auth data, then get firestore user document || null
    this.user = this.afAuth.authState
      .switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges()
        } else {
          return Observable.of(null)
        }
      });
  }



  emailSignUp(email: string, password: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .catch((error) => this.handleError(error));
  }

  emailLogin(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .catch((error) => this.handleError(error));
  }

  // Sends email allowing user to reset password
  //resetPassword(email: string) {
  //  const fbAuth = firebase.auth();

  //  return fbAuth.sendPasswordResetEmail(email)
  //    .then(() => this.notify.update('Password update email sent', 'info'))
  //    .catch((error) => this.handleError(error));
  //}

  signOut() {
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['/']);
    });
  }

  // If error, console log and notify user
  private handleError(error: Error) {
    console.error(error);
    //this.notify.update(error.message, 'error');
  }

  ///// Role-based Authorization //////
  canReadAll(user: User): boolean {
      const allowed = ['admin']
      return this.checkAuthorization(user, allowed)
  }

  // determines if user has matching role
  private checkAuthorization(user: User, allowedRoles: string[]): boolean {
      if (!user) return false
      for (const role of allowedRoles) {
          if (user.roles[role]) {
              return true
          }
      }
      return false
  }
}
