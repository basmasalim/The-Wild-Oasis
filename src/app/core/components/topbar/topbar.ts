import { Component, inject } from '@angular/core';
import { Auth } from '../../../auth/services/auth/auth';

@Component({
  selector: 'app-topbar',
  imports: [],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss',
})
export class Topbar {
  private readonly auth = inject(Auth);

  signOut() {
    this.auth.signOutUser();
  }
}
