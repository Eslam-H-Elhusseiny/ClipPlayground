import { Component, inject, signal } from '@angular/core';
import { InputField } from '../../../shared/layout/input-field/input-field';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthStore } from '../../../shared/services/auth-store';
import { Alert } from '../../../shared/layout/alert/alert';
import { AlertState } from '../../../shared/models/alert-state';
import { AlertStore } from '../../../shared/services/alert-store';
import { noWhitespaceValidator } from '../../../shared/validators/no-whitespace';

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
    email: [
      '',
      [Validators.required, Validators.email, noWhitespaceValidator()],
    ],
    password: ['', [Validators.required, noWhitespaceValidator()]],
  });

  async login() {
    this.inSubmission.set(true);

    this.alert.setAlert('🔐 Logging you in, please wait...', 'blue', true);
    try {
      await this.auth.login(this.loginForm.getRawValue());
      this.alert.setAlert(
        '✅ You have successfully logged in!',
        'green',
        true,
        1500,
      );
    } catch (error) {
      this.alert.setAlert(
        '⛔ Login failed. Invalid credentials.',
        'red',
        true,
        4000,
      );
      this.inSubmission.set(false);
      return;
    }
  }
}
