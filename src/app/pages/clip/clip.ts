import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { ClipList } from '../../shared/layout/clip-list/clip-list';
import { Clip as IClip } from '../../shared/models/clip';
import videojs from 'video.js';
import Player from 'video.js/dist/types/player';

import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-clip',
  imports: [ClipList, DatePipe],
  templateUrl: './clip.html',
  styleUrl: './clip.css',
})
export class Clip implements OnInit, OnDestroy {
  route = inject(ActivatedRoute);
  videoElement =
    viewChild.required<ElementRef<HTMLVideoElement>>('videoPlayer');
  clip = signal<IClip | null>(null);
  player!: Player;

  ngOnInit() {
    this.player = videojs(this.videoElement().nativeElement);

    this.route.data.subscribe((data) => {
      this.clip.set(data['clip']);
      this.player.src({
        src: this.clip()?.clipURL,
        type: 'video/mp4',
      });
    });
  }

  ngOnDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  }
}
