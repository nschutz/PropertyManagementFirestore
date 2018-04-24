import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { ReportService, newReport } from '../core/report.service';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from '../core/auth.service';

type UserFields = 'description' | 'location' | 'photoUrl';
type FormErrors = {[u in UserFields]: string };

@Component({
  selector: 'user-report',
  templateUrl: './user-report.component.html',
  styleUrls: ['./user-report.component.css'],
})
export class UserReportComponent implements OnInit {
  userForm: FormGroup;
  report: newReport;
  task: AngularFireUploadTask;
  downloadURL: Observable<string>;
  selectedFiles: FileList;

  formErrors: FormErrors = {
    'description': '',
    'location': '',
    'photoUrl': '',
  };
  validationMessages = {
    'description': {
      'required': 'Description is required.'
    },
    'location': {
      'required': 'Location is required.'
    },
    'photoUrl': {
      'required': 'Photo is required.'
    },
  };

  constructor(private storage: AngularFireStorage, private reportServ: ReportService,
    private router: Router, private fb: FormBuilder, private afs: AngularFirestore, private afAuth: AngularFireAuth,
    public auth: AuthService) {}

  ngOnInit() {
    this.buildForm();
  }

  detectFiles(event) {
    this.selectedFiles = event.target.files;
  }

  fileReport() {
    const file = this.selectedFiles.item(0)

    if (file.type.split('/')[0] !== 'image') {
      console.error('unsupported file type :( ')
      return;
    }

    const path = `${this.afAuth.auth.currentUser.uid}/${file.name}`;
    this.task = this.storage.upload(path, file)
    this.downloadURL = this.task.downloadURL();

    this.report = {
      uid: this.afAuth.auth.currentUser.uid,
      description: this.userForm.value['description'],
      location: this.userForm.value['location'],
      photoUrl: path,
      time: new Date(),
      completed: false
    };
    this.reportServ.createReport(this.report);
  }

  buildForm() {
    this.userForm = this.fb.group({
      'description': ['', [
        Validators.required
      ]],
      'location': ['', [
        Validators.required
      ]],
      'photoUrl': ['', [
        Validators.required,
        Validators.email,
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
      if (Object.prototype.hasOwnProperty.call(this.formErrors, field) && (field === 'description' || field === 'location' || field === 'photoUrl')) {
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
