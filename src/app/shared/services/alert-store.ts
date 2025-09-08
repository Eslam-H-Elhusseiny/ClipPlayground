import { Injectable, signal } from '@angular/core';
import { AlertState } from '../models/alert-state';

@Injectable({
  providedIn: 'root',
})
export class AlertStore {
  alert = signal<AlertState>({
    alertMessage: '',
    alertColor: 'blue',
    showAlert: false,
  });

  setAlert(
    message: string,
    color: string,
    visible: boolean = true,
    autoClearMs: number = 1500,
  ): void {
    this.alert.set({
      alertMessage: message,
      alertColor: color,
      showAlert: visible,
    });

    if (autoClearMs) {
      setTimeout(() => {
        this.clearAlert();
      }, autoClearMs);
    }
  }

  clearAlert(): void {
    this.alert.set({ alertMessage: '', alertColor: 'blue', showAlert: false });
  }

  readonly getAlert = this.alert.asReadonly();
}
