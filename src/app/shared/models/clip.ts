import { Timestamp } from '@angular/fire/firestore';

export interface Clip {
  docID?: string;
  uid: string;
  displayName: string;
  title: string;
  fileName: string;
  clipURL: string;
  timestamp: Timestamp;
}
