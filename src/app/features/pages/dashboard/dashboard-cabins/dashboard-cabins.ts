import { UserData } from './../dashboard-bookings/user-data';
import { User } from './../../../../auth/interfaces/user';
import { Component, OnInit } from '@angular/core';

import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Iuser } from '../dashboard-bookings/iuser';

import { Icabins } from '../../../../core/interface/icabins';
import { Cabins } from '../../../../core/services/cabins/cabins';

@Component({
  selector: 'app-dashboard-cabins',
  imports: [TableModule, TagModule, RatingModule, CommonModule, ButtonModule],
  templateUrl: './dashboard-cabins.html',
  styleUrl: './dashboard-cabins.scss',
})
export class DashboardCabins implements OnInit {
  cabins!: Icabins[];

  constructor(private cabinServ: Cabins) {}
  ngOnInit(): void {
    this.cabinServ.getCabinsData().subscribe({
      next: (res: any) => {
        this.cabins = res;
      },
    });
  }

  filteredStatus: string = '';

  get filteredCapinData(): Icabins[] {
    if (!this.filteredStatus) return this.cabins;
    return this.cabins.filter((p) => p.inventoryStatus === this.filteredStatus);
  }

  applyFilter(status: string) {
    this.filteredStatus = status;
  }
  getSeverity(status: string) {
    switch (status) {
      case 'indiscount':
        return 'success';
      case 'nodiscount':
        return 'warn';

      default:
        return '';
    }
  }
}
