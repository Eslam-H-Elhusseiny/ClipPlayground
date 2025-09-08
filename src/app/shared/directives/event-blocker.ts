import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appEventBlocker]',
})
export class EventBlocker {
  @HostListener('drop', ['$event'])
  @HostListener('dragover', ['$event'])
  handleEvent($event: Event) {
    $event.preventDefault();
  }
}
