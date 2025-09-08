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
  // Injections used to handle authentication, user data, and routing.
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  router = inject(Router);
  activeRoute = inject(ActivatedRoute);
  redirect = false;

  // Observables for tracking authentication state.
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

  /**
   * Gets the deepest route from the current active route.
   * @param activeRoute The current active route.
   * @returns The deepest nested route.
   */
  getDeepestRoute(activeRoute: ActivatedRoute) {
    let currentRoute = activeRoute;
    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }
    return currentRoute;
  }

  /**
   * Creates a new user with the provided data.
   * @param userData User data for registration.
   * @returns A promise that resolves when the user is successfully created.
   */
  async createUser(userData: User) {
    // Step 1: Register the user with Firebase Auth.
    const userCredential = await createUserWithEmailAndPassword(
      this.auth,
      userData.email,
      userData.password,
    );

    // Step 2: Save additional user data in Firestore.
    await setDoc(doc(this.firestore, 'users', userCredential.user.uid), {
      name: userData.name,
      email: userData.email,
      age: userData.age,
    });

    // Step 3: Update the user's display name in Firebase Auth.
    await updateProfile(userCredential.user, {
      displayName: userData.name,
    });
  }

  /**
   * Login user using the provided credentials.
   * @param credentials user login credentials
   */
  async login(credentials: Login) {
    await signInWithEmailAndPassword(
      this.auth,
      credentials.email,
      credentials.password,
    );
  }

  /**
   * logs out user and navigates to home page if the current route is only accessible while authenticated.
   * @param $event? used to prevent the default behaviour of the <a> tag
   */
  async logout($event?: Event) {
    $event?.preventDefault();

    await signOut(this.auth);

    if (this.redirect) await this.router.navigateByUrl('/');
  }
}
