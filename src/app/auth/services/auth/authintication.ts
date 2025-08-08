import { inject, Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Authintication {
  constructor(private auth: Auth) {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        console.log("User is logged in:", user.email);
      } else {
        console.log("No user is logged in");
      }
    });
  }

  login(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  logout() {
    return signOut(this.auth);
  }








  // login(user: User): boolean {
  //   if (
  //     user.email === FAKE_USER.email &&
  //     user.password === FAKE_USER.password
  //   ) {
  //     this.setToken('fake-token');
  //     return true;
  //   }
  //   return false;
  // }



  // isLoggedIn(): boolean {
  //   return !!this.getToken();
  // }



  // private getToken(): string | null {
  //   return localStorage.getItem(this.TOKEN_KEY);
  // }


}
