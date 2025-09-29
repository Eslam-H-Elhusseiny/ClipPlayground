import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { ClipList } from '../../shared/layout/clip-list/clip-list';

@Component({
  selector: 'app-clip',
  imports: [ClipList],
  templateUrl: './clip.html',
  styleUrl: './clip.css',
})
export class Clip implements OnInit {
  route = inject(ActivatedRoute);
  id = signal('');

  ngOnInit() {
    this.route.params.subscribe((params: Params) => this.id.set(params['id']));
  }
}
