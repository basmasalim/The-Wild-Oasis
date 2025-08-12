import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Iuser } from '../dashboard-bookings/iuser';
import { Icabins } from './icabins';

@Injectable({
  providedIn: 'root',
})
export class Scabins {
  private readonly capinData: Icabins[] = [
    {
      capin: 1,
      Capacity: 'Fits up to 2',
      Price: 1,
      Discount: 42.4,
      price: 55,
      inventoryStatus: 'INSTOCK',
    },
  ];

  getCapinDataMini(): Observable<Icabins[]> {
    return of(this.capinData);
  }
}
