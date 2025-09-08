import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-manage',
  imports: [],
  templateUrl: './manage.html',
  styleUrl: './manage.css',
})
export class Manage implements OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);

  sortOrder = signal('');

  sort($event: Event) {
    const { value } = $event.target as HTMLSelectElement;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { sort: value },
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      this.sortOrder.update(() => (params['sort'] === '2' ? '2' : '1'));
    });
  }
}
