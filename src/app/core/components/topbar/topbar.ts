import { Component, inject } from '@angular/core';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common';
import { Menubar } from 'primeng/menubar';
import { ThemeToggle } from '../../../shared/components/business/theme-toggle/theme-toggle';
import { Authintication } from '../../../auth/services/authintication/authintication';

@Component({
  selector: 'app-topbar',
  imports: [Menubar, BadgeModule, AvatarModule, CommonModule, ThemeToggle],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss',
})
export class Topbar {
  private readonly auth = inject(Authintication);

  toggleDarkMode() {
    const el = document.querySelector('html');
    el?.classList.toggle('app-dark');
  }

  signOut() {
    this.auth.logout();
  }
}
