import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';

@Component({
  selector: 'app-clip',
  imports: [RouterLink],
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
