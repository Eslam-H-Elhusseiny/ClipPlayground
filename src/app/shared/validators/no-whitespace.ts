import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function noWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (typeof value !== 'string' || value === null) {
      return null;
    }

    const isWhitespace = value.trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  };
}
