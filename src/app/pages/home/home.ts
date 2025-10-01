import { Component, inject } from '@angular/core';
import { NgxLavaLampComponent } from '@omnedia/ngx-lava-lamp';
import { RouterLink } from '@angular/router';
import { ClipList } from '../../shared/layout/clip-list/clip-list';
import { AuthStore } from '../../shared/services/auth-store';
import { AsyncPipe } from '@angular/common';
import { ModalManager } from '../../shared/services/modal-manager';

@Component({
  selector: 'app-home',
  imports: [NgxLavaLampComponent, RouterLink, ClipList, AsyncPipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  auth = inject(AuthStore);
  modalManager = inject(ModalManager);

  openModal($event: Event) {
    $event.preventDefault();

    this.modalManager.toggleModal('auth');
  }
}
