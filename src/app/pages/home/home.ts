import { Component } from '@angular/core';
import { NgxLavaLampComponent } from '@omnedia/ngx-lava-lamp';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [NgxLavaLampComponent, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
