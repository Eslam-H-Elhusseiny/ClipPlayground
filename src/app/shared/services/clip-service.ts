import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  Timestamp,
} from '@angular/fire/firestore';
import { Clip } from '../models/clip';

@Injectable({
  providedIn: 'root',
})
export class ClipService {
  private firestore = inject(Firestore);
  private clipsCollection = collection(this.firestore, 'clips');

  async createClip(
    uid: string,
    displayName: string,
    title: string,
    fileName: string,
    clipURL: string,
    timestamp: Timestamp,
  ) {
    const clip: Clip = {
      uid,
      displayName,
      title,
      fileName,
      clipURL,
      timestamp,
    };

    return await addDoc(this.clipsCollection, clip);
  }
}
