import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { EmailAuthProvider, onAuthStateChanged, reauthenticateWithCredential, signInWithEmailAndPassword, signOut, updatePassword, User } from 'firebase/auth';
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

  // ✅ تغيير الباسورد لو المستخدم مسجّل دخول
  async changePassword(oldPassword: string, newPassword: string) {
    const user = this.auth.currentUser;
    if (!user || !user.email) throw new Error('No user logged in');

    try {
      // ✅ اعمل re-authenticate
      const credential = EmailAuthProvider.credential(user.email, oldPassword);
      await reauthenticateWithCredential(user, credential);

      // ✅ لو نجح غيّر الباسورد
      await updatePassword(user, newPassword);

      return { status: 'success', message: 'Password updated successfully' };
    } catch (err: any) {
      return { status: 'error', message: 'Old password is incorrect' };
    }
  }
  // ✅ لو الباسورد قديم (Re-authenticate)
  async reauthenticate(email: string, oldPassword: string) {
    const user = this.auth.currentUser;
    if (!user) throw new Error("No user is logged in");

    const credential = EmailAuthProvider.credential(email, oldPassword);
    try {
      await reauthenticateWithCredential(user, credential);
      return { success: true, message: "Re-authentication successful ✅" };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  logout() {
    this.isLogged.set(false);
    localStorage.setItem('loggedIn', 'false');
    this.router.navigate(['/']);
    return from(signOut(this.auth));
  }


}
