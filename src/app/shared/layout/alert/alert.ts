import { Component, input } from '@angular/core';

@Component({
  selector: 'app-alert',
  imports: [],
  templateUrl: './alert.html',
  styleUrl: './alert.css',
})
export class Alert {
  color = input('blue');

  get bgColor() {
    return `bg-${this.color()}-300`;
  }
}
