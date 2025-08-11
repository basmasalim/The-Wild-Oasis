import { Component } from '@angular/core';
import { Topbar } from '../../../components/topbar/topbar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard-layout',
  imports: [RouterOutlet, Topbar],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.scss',
})
export class DashboardLayout {}
