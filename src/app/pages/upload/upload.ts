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
import { noWhitespaceValidator } from '../../shared/validators/no-whitespace';

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
  thumbnailTask?: UploadTask;

  isDragOver = signal(false);

  videoFile = signal<File | null>(null);
  thumbnailFile = signal<File | null>(null);
  thumbnailPreviewUrl = signal<string | null>(null);

  videoUploaded = signal(false);
  thumbnailUploaded = signal(false);
  nextStep = signal(false);
  uploadPercentage = signal(0);
  inSubmission = signal(false);

  uploadForm = this.fb.nonNullable.group({
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

  private validateFile(file: File | null, type: 'video' | 'image'): boolean {
    if (!file) return false;

    if (type === 'video' && file.type !== 'video/mp4') {
      this.alert.setAlert(
        '⛔ Only MP4 format is allowed. Please upload an MP4 video file.',
        'red',
        true,
        4000,
      );
      return false;
    }

    if (type === 'image' && !file.type.startsWith('image/')) {
      this.alert.setAlert(
        '⛔ Only image files are allowed for thumbnails.',
        'red',
        true,
        4000,
      );
      return false;
    }

    const MAX_SIZE = type === 'video' ? 10 * 1024 * 1024 : 1 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      this.alert.setAlert('⛔ File is too large.', 'red', true, 4000);
      return false;
    }

    return true;
  }

  storeFile($event: Event, type: 'video' | 'image'): void {
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

    if (!this.validateFile(droppedFile, type)) return;

    if (type === 'video') {
      this.videoFile.set(droppedFile);
      this.videoUploaded.set(false);

      const fileName = droppedFile!.name.replace(/\.[^/.]+$/, '').trim();
      this.uploadForm.controls.title.setValue(fileName);
      this.nextStep.set(true);
    } else {
      this.thumbnailFile.set(droppedFile);
      this.thumbnailUploaded.set(false);

      if (this.thumbnailPreviewUrl()) {
        URL.revokeObjectURL(this.thumbnailPreviewUrl()!);
      }

      if (droppedFile) {
        const url = URL.createObjectURL(droppedFile);
        this.thumbnailPreviewUrl.set(url);
      }
    }
  }

  private handleUpload(
    task: UploadTask,
    fileType: 'video' | 'image',
    onComplete: (url: string) => Promise<void>,
  ) {
    fromTask(task).subscribe({
      next: (snapshot: any) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        );

        this.uploadPercentage.set(progress);

        const alertMsg =
          fileType === 'video'
            ? `⌛ Uploading your video... | ${progress}%`
            : `⌛ Uploading thumbnail... | ${progress}%`;

        this.alert.setAlert(alertMsg, 'blue', true);
      },
      error: (err: any) => {
        this.uploadForm.enable();
        this.inSubmission.set(false);

        if (err.code === 'storage/canceled') {
          this.uploadPercentage.set(0);
          this.alert.setAlert(
            `⛔ ${fileType} upload was canceled, please try again.`,
            'orange',
            true,
          );
        } else {
          this.alert.setAlert(
            `⛔ ${fileType} upload failed. Please try again.`,
            'red',
            true,
            4000,
          );
        }
      },
      complete: async () => {
        const storageRef = task.snapshot.ref;
        const url = await getDownloadURL(storageRef);
        await onComplete(url);
      },
    });
  }

  uploadFile(): void {
    if (!this.videoFile() || !this.thumbnailFile()) return;

    this.uploadForm.disable();
    this.inSubmission.set(true);

    const clipFileName = `${uuid()}.mp4`;
    const clipPath = `clips/${clipFileName}`;
    const clipRef = ref(this.storage, clipPath);
    this.clipTask = uploadBytesResumable(clipRef, this.videoFile() as File);

    this.handleUpload(this.clipTask, 'video', async (clipURL: string) => {
      this.videoUploaded.set(true);

      const thumbnailFileName = `${uuid()}-${this.thumbnailFile()!.name}`;
      const thumbnailPath = `thumbnails/${thumbnailFileName}`;
      const thumbnailRef = ref(this.storage, thumbnailPath);

      this.thumbnailTask = uploadBytesResumable(
        thumbnailRef,
        this.thumbnailFile() as File,
      );

      this.handleUpload(
        this.thumbnailTask,
        'image',
        async (thumbnailURL: string) => {
          this.thumbnailUploaded.set(true);

          await this.saveClip(
            clipFileName,
            clipURL,
            thumbnailFileName,
            thumbnailURL,
          );
        },
      );
    });
  }

  filesReady() {
    return this.videoFile() !== null && this.thumbnailFile() !== null;
  }

  private async saveClip(
    clipFileName: string,
    clipURL: string,
    thumbnailFileName: string,
    thumbnailURL: string,
  ) {
    const clipDocRef = await this.clipService.createClip(
      this.auth.currentUser?.uid!,
      this.auth.currentUser?.displayName!,
      this.uploadForm.controls.title.value.trim(),
      clipFileName,
      clipURL,
      thumbnailFileName,
      thumbnailURL,
      serverTimestamp() as Timestamp,
    );

    this.alert.setAlert(
      '✅ Your video and thumbnail were uploaded successfully!',
      'green',
      true,
      2000,
    );

    setTimeout(() => {
      this.router.navigate(['clip', clipDocRef.id]);
    }, 2000);
  }

  ngOnDestroy(): void {
    this.clipTask?.cancel();
    this.thumbnailTask?.cancel();

    if (this.thumbnailPreviewUrl()) {
      URL.revokeObjectURL(this.thumbnailPreviewUrl()!);
    }
  }
}
