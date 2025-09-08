import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-tab',
  imports: [],
  templateUrl: './tab.html',
  styleUrl: './tab.css',
})
export class Tab {
  tabTitle = input('');

  tabStatus = signal(false);
}
