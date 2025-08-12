import { User } from './../../../../auth/interfaces/user';
import { UserData } from './user-data';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { Iuser } from './iuser';
import { Paginator } from 'primeng/paginator';

@Component({
  selector: 'app-dashboard-bookings',
  imports: [
    FormsModule,
    TableModule,
    TagModule,
    RatingModule,
    ButtonModule,
    CommonModule,
  ],
  templateUrl: './dashboard-bookings.html',
  styleUrl: './dashboard-bookings.scss',
})
export class DashboardBookings implements OnInit {
  userData!: Iuser[];

  constructor(private userDataServ: UserData) {}

  totalRecords: number = 0;

  ngOnInit() {
    this.userDataServ.getuserDataMini().subscribe({
      next: (res: any) => {
        this.userData = res;
        this.totalRecords = this.userData.length;
      },
    });
  }

  filteredStatus: string = '';

  get filtereduserData(): Iuser[] {
    if (!this.filteredStatus) return this.userData;
    return this.userData.filter(
      (p) => p.inventoryStatus === this.filteredStatus
    );
  }

  applyFilter(status: string) {
    this.filteredStatus = status;
  }

  getSeverity(status: string) {
    switch (status) {
      case 'checkedin':
        return 'success';
      case 'unconfirmed':
        return 'warn';
      case 'checkedout':
        return 'danger';
      default:
        return '';
    }
  }

  first: number = 0;
  rows: number = 5;
  onClick(event: any) {
    this.first = event.first;
  }

  goToNext() {
    if (!this.isLastPage()) {
      this.first += this.rows;
    }
  }

  goToPrev() {
    if (!this.isFirstPage()) {
      this.first -= this.rows;
    }
  }
  isFirstPage(): boolean {
    return this.first === 0;
  }
  isLastPage(): boolean {
    return this.first + this.rows >= this.totalRecords;
  }
}
