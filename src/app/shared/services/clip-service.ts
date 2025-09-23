import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  Timestamp,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { Clip } from '../models/clip';
import { Auth } from '@angular/fire/auth';
import { deleteObject, ref, Storage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class ClipService {
  private firestore = inject(Firestore);
  private clipsCollection = collection(this.firestore, 'clips');
  private auth = inject(Auth);
  storage = inject(Storage);

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

  async getUserClips() {
    const q = query(
      this.clipsCollection,
      where('uid', '==', this.auth.currentUser?.uid),
    );

    return await getDocs(q);
  }

  async updateClip(id: string, title: string) {
    const clipRef = doc(this.firestore, 'clips', id);

    return await updateDoc(clipRef, { title });
  }

  async deleteClip(clip: Clip) {
    const fileRef = ref(this.storage, `clips/${clip.fileName}`);

    await deleteObject(fileRef);

    const docRef = doc(this.firestore, 'clips', clip.docID as string);

    await deleteDoc(docRef);
  }
}
