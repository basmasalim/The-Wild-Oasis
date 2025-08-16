import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { CABINS_MOCK } from '../../mock/cabins.mock';
import { Icabins } from '../../interfaces/icabins';

@Injectable({
  providedIn: 'root',
})
export class Cabins {
  private readonly cabinsData = CABINS_MOCK;

  getCabinsData(): Observable<Icabins[]> {
    return of(this.cabinsData);
  }
}
