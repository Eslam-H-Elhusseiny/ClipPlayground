import { DatePipe } from '@angular/common';
import { Component, Input, Signal } from '@angular/core';
import { Clip } from '../../models/clip';

@Component({
  selector: 'app-clip-card',
  imports: [DatePipe],
  templateUrl: './clip-card.html',
  styleUrl: './clip-card.css',
})
export class ClipCard {
  @Input({ required: true }) clip!: Clip;
}
