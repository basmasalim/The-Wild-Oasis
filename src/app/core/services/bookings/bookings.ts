import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { collection, collectionData, deleteDoc, doc, docData, Firestore } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Bookings {
  private firestore = inject(Firestore);
  status: WritableSignal<string> = signal('Unconfirmed');
  checkIn: WritableSignal<number> = signal(0);

  // تجيب كل الـ bookings
  getBookings(): Observable<any[]> {
    const bookingsRef = collection(this.firestore, 'bookings');
    return collectionData(bookingsRef, { idField: 'id' }) as Observable<any[]>;
  }

  // تجيب booking واحد بالـ id
  getBookingById(id: string): Observable<any> {
    const bookingRef = doc(this.firestore, `bookings/${id}`);
    return docData(bookingRef, { idField: 'id' }) as Observable<any>;
  }



  deleteBooking(bookingId: string | undefined): Observable<void> {
    if (!bookingId) throw new Error("booking id is missing");
    const bookingRef = doc(this.firestore, `bookings/${bookingId}`);
    return from(deleteDoc(bookingRef));
  }

}
