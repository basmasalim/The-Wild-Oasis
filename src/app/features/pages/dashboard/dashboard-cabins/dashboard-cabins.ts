import { UserData } from './../dashboard-bookings/user-data';
import { User } from './../../../../auth/interfaces/user';
import { Component, OnInit } from '@angular/core';

import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Iuser } from '../dashboard-bookings/iuser';
import { Scabins } from './scabins';

@Component({
  selector: 'app-dashboard-cabins',
  imports: [TableModule, TagModule, RatingModule, CommonModule, ButtonModule],
  templateUrl: './dashboard-cabins.html',
  styleUrl: './dashboard-cabins.scss',
})
export class DashboardCabins implements OnInit {
  cabins!: Scabins[];

  constructor(private ScabinsServ: Scabins) {}
  ngOnInit() {
    this.ScabinsServ.getCapinDataMini().subscribe({
      next: (res: any) => {
        this.cabins = res;
      },
    });
  }

  getSeverity(status: string) {
    switch (status) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warn';
      case 'OUTOFSTOCK':
        return 'danger';
      default:
        return '';
    }
  }
}
