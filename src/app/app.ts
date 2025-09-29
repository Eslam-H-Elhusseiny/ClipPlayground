import { Component, inject } from '@angular/core';
import { Nav } from './core/layout/nav/nav';
import { AuthModal } from './core/auth/auth-modal/auth-modal';
import { AuthStore } from './shared/services/auth-store';
import { AsyncPipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Footer } from './core/layout/footer/footer';
import { BackToTop } from './core/layout/back-to-top/back-to-top';

@Component({
  selector: 'app-root',
  imports: [Nav, AuthModal, AsyncPipe, RouterOutlet, Footer, BackToTop],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'ClipPlayground';
  auth = inject(AuthStore);
}
