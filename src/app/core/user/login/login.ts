import { Component, inject, signal } from '@angular/core';
import { InputField } from '../../../shared/layout/input-field/input-field';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthStore } from '../../../shared/services/auth-store';
import { Alert } from '../../../shared/layout/alert/alert';
import { AlertState } from '../../../shared/models/alert-state';
import { AlertStore } from '../../../shared/services/alert-store';

@Component({
  selector: 'app-login',
  imports: [InputField, ReactiveFormsModule, Alert],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  fb = inject(FormBuilder);
  auth = inject(AuthStore);
  alert = inject(AlertStore);

  inSubmission = signal(false);

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.pattern(
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
        ),
      ],
    ],
  });

  async login() {
    this.inSubmission.set(true);

    this.alert.setAlert('Please Wait, While Signing You In.', 'blue', true);
    try {
      await this.auth.login(this.loginForm.getRawValue());
      this.alert.setAlert('Success!', 'green', true);
    } catch (error) {
      this.alert.setAlert('Login failed. Please try again.', 'red', true);
      this.inSubmission.set(false);
      console.error(error);
      return;
    }
  }
}
