import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { SidebarService } from '../../services/SidebarService/sidebar-service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  constructor(public sidebar: SidebarService) { }
}
