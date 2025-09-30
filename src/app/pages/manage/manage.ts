import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, Params, RouterLink } from '@angular/router';
import { ClipService } from '../../shared/services/clip-service';
import { Clip } from '../../shared/models/clip';
import { Edit } from './edit/edit';
import { ModalManager } from '../../shared/services/modal-manager';
import { ClipPlaceholder } from '../../shared/layout/clip-placeholder/clip-placeholder';
import { ClipCard } from '../../shared/layout/clip-card/clip-card';

@Component({
  selector: 'app-manage',
  imports: [Edit, RouterLink, ClipPlaceholder, ClipCard],
  templateUrl: './manage.html',
  styleUrl: './manage.css',
})
export class Manage implements OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);
  clipService = inject(ClipService);
  modalManager = inject(ModalManager);

  sortOrder = signal('');
  clips = signal<Clip[]>([]);
  activeClip = signal<Clip | null>(null);
  orderedClips = computed(() => {
    return this.clips().sort((a, b) => {
      return this.sortOrder() === '1'
        ? b.timestamp.toMillis() - a.timestamp.toMillis()
        : a.timestamp.toMillis() - b.timestamp.toMillis();
    });
  });

  sortClips($event: Event) {
    const { value } = $event.target as HTMLSelectElement;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { sort: value },
    });
  }

  async ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      this.sortOrder.update(() => (params['sort'] === '2' ? '2' : '1'));
    });

    const clipDocs = await this.clipService.getUserClips();
    const userClips = clipDocs.docs.map((document) => {
      const data = document.data();
      return {
        docID: document.id,
        uid: data['uid'],
        displayName: data['displayName'],
        title: data['title'],
        clipFileName: data['clipFileName'],
        clipURL: data['clipURL'],
        thumbnailFileName: data['thumbnailFileName'],
        thumbnailURL: data['thumbnailURL'],
        timestamp: data['timestamp'],
      } as Clip;
    });
    this.clips.set(userClips);
  }

  openModal($event: Event, clip: Clip) {
    $event.preventDefault();

    this.activeClip.set(clip);

    this.modalManager.toggleModal('editClip');
  }

  updateClip(targetClip: Clip) {
    this.clips.update((currentClips) =>
      currentClips.map((clip) =>
        clip.docID === targetClip.docID
          ? { ...clip, title: targetClip.title }
          : clip,
      ),
    );
  }

  deleteClip(docID: string) {
    this.clips.update((clips) => clips.filter((clip) => clip.docID !== docID));
  }
}
