import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  updateProfile,
  authState,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { User, Login } from '../models/user';
import { delay, filter, map, switchMap } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  router = inject(Router);
  activeRoute = inject(ActivatedRoute);
  redirect = false;

  authState$ = authState(this.auth);
  authStateWithDelay$ = authState(this.auth).pipe(delay(1000));

  constructor() {
    // Subscribes to the router events to get the current active route data
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.getDeepestRoute(this.activeRoute)),
        switchMap((route) => route.data),
      )
      .subscribe((data) => {
        this.redirect = data['authOnly'] ?? false;
      });
  }

  getDeepestRoute(activeRoute: ActivatedRoute) {
    let currentRoute = activeRoute;
    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }
    return currentRoute;
  }

  async createUser(userData: User) {
    // Register the user with Firebase Auth.
    const userCredential = await createUserWithEmailAndPassword(
      this.auth,
      userData.email,
      userData.password,
    );

    // Save additional user data in Firestore.
    await setDoc(doc(this.firestore, 'users', userCredential.user.uid), {
      name: userData.name,
      email: userData.email,
      age: userData.age,
    });

    // Update the user's display name.
    await updateProfile(userCredential.user, {
      displayName: userData.name,
    });
  }

  async login(credentials: Login) {
    await signInWithEmailAndPassword(
      this.auth,
      credentials.email,
      credentials.password,
    );
  }

  async logout($event?: Event) {
    $event?.preventDefault();

    await signOut(this.auth);

    if (this.redirect) await this.router.navigateByUrl('/');
  }
}
