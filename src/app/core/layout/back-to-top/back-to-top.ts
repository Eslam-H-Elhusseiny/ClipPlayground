import { Component, HostListener, signal } from '@angular/core';

@Component({
  selector: 'app-back-to-top',
  imports: [],
  templateUrl: './back-to-top.html',
  styleUrl: './back-to-top.css',
})
export class BackToTop {
  private previousScrollY = 0;

  showButton = signal(false);

  @HostListener('window:scroll', [])
  onScroll(): void {
    const currentScrollY = window.scrollY || document.documentElement.scrollTop;

    const isScrollingUp = currentScrollY < this.previousScrollY;
    const scrollThreshold = currentScrollY > 300;

    this.showButton.set(scrollThreshold && isScrollingUp);

    this.previousScrollY = currentScrollY;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
