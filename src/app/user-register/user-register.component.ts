import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';

import { AuthService } from '../core/auth.service';
import { Roles, User } from '../core/user';

type UserFields = 'name' | 'address' | 'email' | 'password';
type FormErrors = {[u in UserFields]: string };

@Component({
  selector: 'user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css'],
})
export class UserRegisterComponent implements OnInit {

  userForm: FormGroup;
  formErrors: FormErrors = {
    'name': '',
    'address': '',
    'email': '',
    'password': '',
  };
  validationMessages = {
    'name': {
      'required': 'Name is required.'
    }, 
    'address': {
      'required': 'Address is required.'
    },
    'email': {
      'required': 'Email is required.',
      'email': 'Email must be a valid email',
    },
    'password': {
      'required': 'Password is required.',
      'minlength': 'Password must be at least 4 characters long.',
      'maxlength': 'Password cannot be more than 40 characters long.',
    },
  };

  constructor(public auth: AuthService,
    private router: Router, private fb: FormBuilder, private afs: AngularFirestore) { }

  ngOnInit() {
    this.buildForm();
  }

  signUpWithEmail() {
    this.auth.emailSignUp(this.userForm.value['email'], this.userForm.value['password'])
      .then((user) => this.afterSignIn(user));
  }

  /// Shared
  private afterSignIn(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

    const data: User = {
      address: this.userForm.value['address'],
      email: user.email,
      name: this.userForm.value['name'],
      uid: user.uid,
      roles: {
        renter: true
      }
    };
    userRef.set(data, { merge: true })
    this.router.navigate(['/home']);
  }

  buildForm() {
    this.userForm = this.fb.group({
      'name': ['', [
        Validators.required
      ]],
      'address': ['', [
        Validators.required
      ]],
      'email': ['', [
        Validators.required,
        Validators.email,
      ]],
      'password': ['', [
        Validators.minLength(6),
        Validators.maxLength(25),
      ]],
    });

    this.userForm.valueChanges.subscribe((data) => this.onValueChanged(data));
    this.onValueChanged(); // reset validation messages
  }

  // Updates validation state on form changes.
  onValueChanged(data?: any) {
    if (!this.userForm) { return; }
    const form = this.userForm;
    for (const field in this.formErrors) {
      if (Object.prototype.hasOwnProperty.call(this.formErrors, field) && (field === 'name' || field === 'address' || field === 'email' || field === 'password')) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          if (control.errors) {
            for (const key in control.errors) {
              if (Object.prototype.hasOwnProperty.call(control.errors, key)) {
                this.formErrors[field] += `${(messages as { [key: string]: string })[key]} `;
              }
            }
          }
        }
      }
    }
  }

}
