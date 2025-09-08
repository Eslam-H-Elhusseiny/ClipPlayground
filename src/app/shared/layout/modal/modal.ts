import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  input,
  OnDestroy,
  viewChild,
} from '@angular/core';
import { ModalManager } from '../../services/modal-manager';

@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal implements AfterViewInit, OnDestroy {
  modalManager = inject(ModalManager);

  modalId = input.required<string>();
  dialog = viewChild.required<ElementRef<HTMLDialogElement>>('baseDialog');

  ngAfterViewInit(): void {
    this.modalManager.setModal(this.modalId(), this.dialog().nativeElement);
  }

  ngOnDestroy(): void {
    this.modalManager.unregisterModal(this.modalId());
  }
}
