import { Routes } from '@angular/router';
import { AuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const redirectUnauthorizedToHome = () => redirectUnauthorizedTo('/');

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((c) => c.Home),
    title: 'Home | ClipPlayground',
    pathMatch: 'full',
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about').then((c) => c.About),
    title: 'About Us | ClipPlayground',
  },
  {
    path: 'clip/:id',
    loadComponent: () => import('./pages/clip/clip').then((c) => c.Clip),
    title: `Clip | ClipPlayground`,
    data: {
      authOnly: true,
      authGuardPipe: redirectUnauthorizedToHome,
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'manage',
    loadComponent: () => import('./pages/manage/manage').then((c) => c.Manage),
    title: 'Manage Videos | ClipPlayground',
    data: {
      authOnly: true,
      authGuardPipe: redirectUnauthorizedToHome,
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'upload',
    loadComponent: () => import('./pages/upload/upload').then((c) => c.Upload),
    title: 'Upload Videos | ClipPlayground',
    data: {
      authOnly: true,
      authGuardPipe: redirectUnauthorizedToHome,
    },
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    title: 'Page Not Found | ClipPlayground',
    loadComponent: () =>
      import('./pages/not-found/not-found').then((c) => c.NotFound),
  },
];
