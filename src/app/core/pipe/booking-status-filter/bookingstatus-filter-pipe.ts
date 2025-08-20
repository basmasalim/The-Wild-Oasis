import { Pipe, PipeTransform } from '@angular/core';
import { IBookings } from '../../interfaces/ibookings';

@Pipe({
  name: 'bookingstatusFilter'
})
export class BookingstatusFilterPipe implements PipeTransform {

  transform(bookings: IBookings[], status: 'unconfirmed' | 'check in' | 'check out' | ''): IBookings[] {
    if (!bookings) return [];
    if (!status) return bookings;

    return bookings.filter(b => this.getStatus(b.startDate, b.endDate) === status);
  }

  private getStatus(startDate: string, endDate: string): 'unconfirmed' | 'check in' | 'check out' {
    const today = new Date().toISOString().split('T')[0];
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date(today);

    if (!startDate && !endDate) return 'unconfirmed';
    if (start <= now && end >= now) return 'check in';
    if (end < now) return 'check out';
    if (start > now) return 'unconfirmed';

    return 'unconfirmed';
  }
}
