import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputField } from '../../../shared/layout/input-field/input-field';
import { AuthStore } from '../../../shared/services/auth-store';
import { Alert } from '../../../shared/layout/alert/alert';
import { AlertStore } from '../../../shared/services/alert-store';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, InputField, Alert],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  fb = inject(FormBuilder);
  auth = inject(AuthStore);
  alert = inject(AlertStore);

  inSubmission = signal(false);

  registerForm = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      age: [, [Validators.required, Validators.min(13), Validators.max(99)]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
          ),
        ],
      ],
      confirmPassword: ['', [Validators.required]],
      // phoneNumber: [''],
    },
    {
      validators: (registerForm) => {
        const password = registerForm.get('password')?.value;
        const confirmPassword = registerForm.get('confirmPassword');

        if (password !== confirmPassword?.value) {
          confirmPassword?.setErrors({ passwordMismatch: true });
        } else {
          confirmPassword?.setErrors(null);
        }

        return null;
      },
    },
  );

  async registerUser() {
    this.inSubmission.set(true);
    this.alert.setAlert(
      '📝 Creating your account, please wait...',
      'blue',
      true,
      2000,
    );

    try {
      await this.auth.createUser(this.registerForm.getRawValue());
      this.alert.setAlert(
        '✅ Your account has been created successfully!',
        'green',
        true,
        2000,
      );
    } catch (error) {
      this.inSubmission.set(false);
      this.alert.setAlert(
        '⛔ Registration failed. Please try again.',
        'red',
        true,
        2000,
      );

      console.error(error);
      return;
    }
  }
}
