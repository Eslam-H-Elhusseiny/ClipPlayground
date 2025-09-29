import {
  Component,
  inject,
  Input,
  signal,
  WritableSignal,
} from '@angular/core';
import { ClipCard } from '../clip-card/clip-card';
import { ClipPlaceholder } from '../clip-placeholder/clip-placeholder';
import { Clip } from '../../models/clip';
import { ClipService } from '../../services/clip-service';

@Component({
  selector: 'app-clip-list',
  imports: [ClipCard, ClipPlaceholder],
  templateUrl: './clip-list.html',
  styleUrl: './clip-list.css',
})
export class ClipList {
  @Input() batchSize: number = 6;
  @Input() showLoadMore: boolean = true;

  clipService = inject(ClipService);

  clips: WritableSignal<Clip[]> = signal([]);
  isLoading = signal(false);

  ngOnInit(): void {
    this.loadClips(true);
  }

  async loadClips(reset: boolean = false) {
    if (this.isLoading()) {
      return;
    }

    this.isLoading.set(true);

    try {
      const newClips = await this.clipService.getClips(reset, this.batchSize);

      if (reset) {
        this.clips.set(newClips);
      } else {
        this.clips.update((prevClips) => [...prevClips, ...newClips]);
      }
    } catch (error) {
      console.error('Error loading clips:', error);
    } finally {
      this.isLoading.set(false);
    }
  }
}
