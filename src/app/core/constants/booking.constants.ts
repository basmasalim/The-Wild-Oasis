import { BookingStatus } from '../enum/booking-status.enum';

export const BOOKING_STATUS_OPTIONS = [
  { label: 'All', value: '' as const },
  { label: 'Checked Out', value: BookingStatus.CheckedOut },
  { label: 'Checked In', value: BookingStatus.CheckedIn },
  { label: 'Unconfirmed', value: BookingStatus.Unconfirmed },
] ;
