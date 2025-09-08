import { Injectable, signal } from '@angular/core';

interface Modal {
  id: string;
  element: HTMLDialogElement;
}

@Injectable({
  providedIn: 'root',
})
export class ModalManager {
  private modals = signal<Modal[]>([]);

  setModal(id: string, element: HTMLDialogElement) {
    this.modals.set([
      ...this.modals(),
      {
        id,
        element,
      },
    ]);
  }

  toggleModal(id: string) {
    const modal = this.modals().find((m) => m.id === id);

    if (!modal) return;

    if (modal.element.open) {
      modal.element.close();
    } else {
      modal.element.showModal();
    }
  }

  unregisterModal(id: string) {
    this.modals.set(this.modals().filter((element) => element.id !== id));
  }
}
