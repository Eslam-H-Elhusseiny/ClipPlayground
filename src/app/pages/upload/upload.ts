import { Component, inject, signal } from '@angular/core';
import { EventBlocker } from '../../shared/directives/event-blocker';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputField } from '../../shared/layout/input-field/input-field';
import { Storage } from '@angular/fire/storage';

@Component({
  selector: 'app-upload',
  imports: [EventBlocker, ReactiveFormsModule, InputField],
  templateUrl: './upload.html',
  styleUrl: './upload.css',
})
export class Upload {
  fb = inject(FormBuilder);
  private storage = inject(Storage);

  isDragOver = signal(false);
  file = signal<File | null>(null);
  nextStep = signal(false);

  uploadForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
  });

  storeFile($event: Event) {
    this.isDragOver.set(false);

    const droppedFile =
      ($event as DragEvent).dataTransfer?.files.item(0) ?? null;

    this.file.set(droppedFile);

    if (!droppedFile || droppedFile.type !== 'video/mp4') return;

    const fileName = droppedFile.name.replace(/\.[^/.]+$/, '');
    this.uploadForm.controls.title.setValue(fileName);

    this.nextStep.set(true);

    console.log(droppedFile);
  }

  uploadFile() {
    console.log('Uploaded !');
  }
}
