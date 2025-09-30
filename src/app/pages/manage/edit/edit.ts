import {
  Component,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { Modal } from '../../../shared/layout/modal/modal';
import { Clip } from '../../../shared/models/clip';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputField } from '../../../shared/layout/input-field/input-field';
import { Alert } from '../../../shared/layout/alert/alert';
import { AlertStore } from '../../../shared/services/alert-store';
import { ClipService } from '../../../shared/services/clip-service';
import { ModalManager } from '../../../shared/services/modal-manager';
import { noWhitespaceValidator } from '../../../shared/validators/no-whitespace';

@Component({
  selector: 'app-edit',
  imports: [Modal, ReactiveFormsModule, InputField, Alert],
  templateUrl: './edit.html',
  styleUrl: './edit.css',
})
export class Edit {
  activeClip = input<Clip | null>(null);
  updatedClipData = output<Clip>();
  deletedClipData = output<string>();

  fb = inject(FormBuilder);
  alert = inject(AlertStore);
  clipService = inject(ClipService);
  modal = inject(ModalManager);

  inSubmission = signal(false);
  confirmDelete = signal(false);

  editClipForm = this.fb.nonNullable.group({
    id: [''],
    title: [
      '',
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(100),
        noWhitespaceValidator(),
      ],
    ],
  });

  constructor() {
    effect(() => {
      const clip = this.activeClip();

      if (clip) {
        this.editClipForm.reset({
          id: clip.docID,
          title: clip.title,
        });
      }
    });
  }

  async editClip() {
    const control = this.editClipForm.controls;
    let newTitle = control.title.value;
    newTitle = newTitle.trim();

    this.inSubmission.set(true);
    this.alert.setAlert(
      '📝 Please wait while updating your clip',
      'blue',
      true,
      2000,
    );

    try {
      control.title.setValue(newTitle);

      await this.clipService.updateClip(control.id.value, newTitle);
    } catch (err) {
      this.inSubmission.set(false);
      this.alert.setAlert(
        '⛔ Error while updating your clip',
        'red',
        true,
        2000,
      );

      return;
    }

    const updatedClip = this.activeClip();
    if (updatedClip) {
      updatedClip.title = newTitle;
      this.updatedClipData.emit(updatedClip);
    }

    this.alert.setAlert('✅ Clip updated succesfully!', 'green', true, 2000);

    setTimeout(() => {
      this.modal.toggleModal('editClip');
      this.inSubmission.set(false);
    }, 1400);
  }

  async deleteClip() {
    const clip = this.activeClip();
    if (!clip) return;

    this.inSubmission.set(true);
    this.alert.setAlert('🗑️ Deleting your clip...', 'blue', true, 2000);

    try {
      await this.clipService.deleteClip(clip);
      this.deletedClipData.emit(clip.docID!);

      this.alert.setAlert('✅ Clip deleted successfully!', 'green', true, 2000);
      setTimeout(() => this.modal.toggleModal('editClip'), 1400);
    } catch {
      this.alert.setAlert('⛔ Failed to delete clip', 'red', true, 2000);
    }
  }
}
