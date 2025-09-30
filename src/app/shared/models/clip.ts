import { Timestamp } from '@angular/fire/firestore';

export interface Clip {
  docID?: string;
  uid: string;
  displayName: string;
  title: string;
  clipFileName: string;
  clipURL: string;
  thumbnailFileName: string;
  thumbnailURL: string;
  timestamp: Timestamp;
}
