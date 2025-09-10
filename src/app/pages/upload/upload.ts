import { Component, inject, OnDestroy, signal } from '@angular/core';
import { EventBlocker } from '../../shared/directives/event-blocker';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputField } from '../../shared/layout/input-field/input-field';
import {
  Storage,
  fromTask,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  UploadTask,
} from '@angular/fire/storage';
import { AlertStore } from '../../shared/services/alert-store';
import { Alert } from '../../shared/layout/alert/alert';
import { v4 as uuid } from 'uuid';
import { Auth } from '@angular/fire/auth';
import { ClipService } from '../../shared/services/clip-service';
import { Router } from '@angular/router';
import { serverTimestamp, Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-upload',
  imports: [EventBlocker, ReactiveFormsModule, InputField, Alert],
  templateUrl: './upload.html',
  styleUrl: './upload.css',
})
export class Upload implements OnDestroy {
  fb = inject(FormBuilder);
  private storage = inject(Storage);
  private auth = inject(Auth);
  private clipService = inject(ClipService);
  private router = inject(Router);
  alert = inject(AlertStore);
  clipTask?: UploadTask;

  isDragOver = signal(false);
  file = signal<File | null>(null);
  nextStep = signal(false);
  uploadPercentage = signal(0);
  inSubmission = signal(false);

  uploadForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
  });

  private validateFile(file: File | null): boolean {
    if (!file || file.type !== 'video/mp4') {
      this.alert.setAlert(
        '⛔ Only MP4 format is allowed. Please upload an MP4 video file.',
        'red',
        true,
        4000,
      );
      return false;
    }

    const MAX_SIZE = 15 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      this.alert.setAlert(
        '⛔ The selected file is too large. Maximum allowed size is 15MB.',
        'red',
        true,
        4000,
      );
      return false;
    }

    return true;
  }

  storeFile($event: Event): void {
    this.isDragOver.set(false);

    let droppedFile: File | null = null;

    if ($event instanceof DragEvent && $event.dataTransfer) {
      droppedFile = $event.dataTransfer.files.item(0);
    } else if (
      $event.target instanceof HTMLInputElement &&
      $event.target.files
    ) {
      droppedFile = $event.target.files.item(0);
    }
    this.file.set(droppedFile);

    if (!this.validateFile(droppedFile)) return;

    const fileName = droppedFile!.name.replace(/\.[^/.]+$/, '');
    this.uploadForm.controls.title.setValue(fileName);

    this.nextStep.set(true);
  }

  uploadFile(): void {
    const clipFileName = `${uuid()}.mp4`;
    const clipPath = `clips/${clipFileName}`;
    const clipRef = ref(this.storage, clipPath);
    this.clipTask = uploadBytesResumable(clipRef, this.file() as File);

    fromTask(this.clipTask).subscribe({
      next: (snapshot: any) => {
        this.uploadForm.disable();
        this.inSubmission.set(true);
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        );

        this.uploadPercentage.set(progress);

        this.alert.setAlert(
          `⌛ Uploading your video... Please wait | ${this.uploadPercentage()}%`,
          'blue',
          true,
        );
      },
      error: (err: any) => {
        if (err.code === 'storage/canceled') {
          this.uploadPercentage.set(0);
          this.alert.setAlert(
            '⛔ Your last upload was canceled, please try again.',
            'orange',
            true,
          );
          return;
        }
        this.uploadForm.enable();
        this.inSubmission.set(false);
      },
      complete: async () => {
        const clipURL = await getDownloadURL(clipRef);

        const clipDocRef = await this.clipService.createClip(
          this.auth.currentUser?.uid!,
          this.auth.currentUser?.displayName!,
          this.uploadForm.controls.title.value,
          clipFileName,
          clipURL,
          serverTimestamp() as Timestamp,
        );

        this.alert.setAlert(
          '✅ Your video was uploaded successfully!',
          'green',
          true,
          2000,
        );

        setTimeout(() => {
          this.router.navigate(['clip', clipDocRef.id]);
        }, 2000);
      },
    });
  }

  ngOnDestroy(): void {
    this.clipTask?.cancel();
  }
}
