import { Component, inject } from '@angular/core';
import { ModalManager } from '../../../shared/services/modal-manager';
import { AuthStore } from '../../../shared/services/auth-store';
import { AsyncPipe } from '@angular/common';
import {
  IsActiveMatchOptions,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';

@Component({
  selector: 'app-nav',
  imports: [AsyncPipe, RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {
  modalManager = inject(ModalManager);
  auth = inject(AuthStore);

  openModal($event: Event) {
    $event.preventDefault();

    this.modalManager.toggleModal('auth');
  }
}
