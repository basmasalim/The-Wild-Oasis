import { Component, inject, signal, WritableSignal } from '@angular/core';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common';
import { Menubar } from 'primeng/menubar';
import { ThemeToggle } from '../../../shared/components/business/theme-toggle/theme-toggle';
import { Authintication } from '../../../auth/services/authintication/authintication';
import { RouterLink } from '@angular/router';
import { SidebarService } from '../../services/SidebarService/sidebar-service';
import { IUser } from '../../interfaces/iuser';
import { Admin } from '../../services/Admin/admin';

@Component({
  selector: 'app-topbar',
  imports: [
    Menubar,
    BadgeModule,
    AvatarModule,
    CommonModule,
    ThemeToggle,
    RouterLink,
  ],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss',
})
export class Topbar {
  private readonly auth = inject(Authintication);
  private accountService = inject(Admin);
  userImage = this.accountService.userImage;
  userName = this.accountService.userName;
  userAccount: WritableSignal<IUser> = signal({} as IUser);
  ngOnInit(): void {
    this.accountService.loadUserFromStorage();
  }

  toggleDarkMode() {
    const el = document.querySelector('html');
    el?.classList.toggle('app-dark');
  }
  constructor(public sidebar: SidebarService) { }

  toggleMenu(): void {
    this.sidebar.toggle()
  }

  signOut() {
    this.auth.logout();
  }
}
