import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-field',
  imports: [ReactiveFormsModule],
  templateUrl: './input-field.html',
  styleUrl: './input-field.css',
})
export class InputField {
  control = input.required<FormControl>();

  type = input('text');

  placeholder = input('');
}
