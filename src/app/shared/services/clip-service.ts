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
  QueryConstraint,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
  getDoc,
} from '@angular/fire/firestore';
import { Clip } from '../models/clip';
import { Auth } from '@angular/fire/auth';
import { deleteObject, ref, Storage } from '@angular/fire/storage';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ClipService {
  private firestore = inject(Firestore);
  private clipsCollection = collection(this.firestore, 'clips');
  private auth = inject(Auth);
  storage = inject(Storage);
  router = inject(Router);

  lastClip: DocumentSnapshot<Clip> | null = null;
  finishedLoading = false;

  async createClip(
    uid: string,
    displayName: string,
    title: string,
    clipFileName: string,
    clipURL: string,
    thumbnailFileName: string,
    thumbnailURL: string,
    timestamp: Timestamp,
  ) {
    const clip: Clip = {
      uid,
      displayName,
      title,
      clipFileName,
      clipURL,
      thumbnailFileName,
      thumbnailURL,
      timestamp,
    };

    return await addDoc(this.clipsCollection, clip);
  }

  resetPagination() {
    this.lastClip = null;
    this.finishedLoading = false;
  }

  async getClips(reset = false, batchSize: number = 6) {
    // Reset pagination
    if (reset) {
      this.lastClip = null;
      this.finishedLoading = false;
    }

    if (this.finishedLoading && !reset) {
      return [];
    }

    const queryParams: QueryConstraint[] = [
      orderBy('timestamp', 'desc'),
      limit(batchSize),
    ];

    if (this.lastClip) {
      queryParams.push(startAfter(this.lastClip));
    }

    const q = query(this.clipsCollection, ...queryParams);
    const snapshot = await getDocs(q);

    if (snapshot.docs.length === 0) {
      this.finishedLoading = true;
      return [];
    }

    this.lastClip = snapshot.docs[
      snapshot.docs.length - 1
    ] as DocumentSnapshot<Clip>;

    if (snapshot.docs.length < batchSize) {
      this.finishedLoading = true;
    }

    return snapshot.docs.map((doc) => ({
      docID: doc.id,
      ...(doc.data() as Omit<Clip, 'docID'>),
    }));
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
    const clipRef = ref(this.storage, `clips/${clip.clipFileName}`);
    await deleteObject(clipRef);

    if (clip.thumbnailFileName) {
      const thumbnailRef = ref(
        this.storage,
        `thumbnails/${clip.thumbnailFileName}`,
      );
      await deleteObject(thumbnailRef);
    }

    const clipDocRef = doc(this.firestore, 'clips', clip.docID as string);
    await deleteDoc(clipDocRef);
  }

  async resolveClip(id: string) {
    const snapshot = await getDoc(doc(this.firestore, 'clips', id));

    if (!snapshot.exists()) {
      this.router.navigateByUrl('/404');
      return null;
    }

    return snapshot.data() as Clip;
  }
}
