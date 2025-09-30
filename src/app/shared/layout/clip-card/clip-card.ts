import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Clip } from '../../models/clip';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-clip-card',
  imports: [DatePipe, RouterLink],
  templateUrl: './clip-card.html',
  styleUrl: './clip-card.css',
})
export class ClipCard {
  @Input({ required: true }) clip!: Clip;
}
