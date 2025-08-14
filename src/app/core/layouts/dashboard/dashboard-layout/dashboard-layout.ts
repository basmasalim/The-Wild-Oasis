import { Component } from '@angular/core';
import { Topbar } from '../../../components/topbar/topbar';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../../components/sidebar/sidebar';

@Component({
  selector: 'app-dashboard-layout',
  imports: [RouterOutlet, Topbar, Sidebar],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.scss',
})
export class DashboardLayout {}
