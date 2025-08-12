import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Authintication {
  isLogged: WritableSignal<boolean> = signal(false);
  private readonly router = inject(Router);
  constructor(private auth: Auth) {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        console.log("User is logged in:", user.email);
        this.isLogged.set(true);
      } else {
        this.isLogged.set(false);
        console.log("No user is logged in");
      }
    });
  }


  login(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  logout() {
    this.isLogged.set(false);
    localStorage.setItem('loggedIn', 'false');
    this.router.navigate(['/']);
    return from(signOut(this.auth));
  }


}
