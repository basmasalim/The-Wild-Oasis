import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Iguest } from '../../interfaces/iguest';
import { Guest_MOCK } from '../../mock/guest.mock';

@Injectable({
  providedIn: 'root',
})
export class GuestUserData {
  private readonly guestData = Guest_MOCK;

  getGuestDataMini(): Observable<Iguest[]> {
    return of(this.guestData);
  }
}
