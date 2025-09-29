import { Component } from '@angular/core';
import { NgxLavaLampComponent } from '@omnedia/ngx-lava-lamp';
import { RouterLink } from '@angular/router';
import { ClipList } from '../../shared/layout/clip-list/clip-list';

@Component({
  selector: 'app-home',
  imports: [NgxLavaLampComponent, RouterLink, ClipList],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
