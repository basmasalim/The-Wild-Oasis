export interface IBookings {
  id: string;
  cabinId: number;
  createdAt: string;
  startDate: string;
  endDate: string;
  guestEmail: string;
  guestId: number;
  guestName: string;
  hasBreakfast: boolean;
  isPaid: boolean;
  numGuests: number;
  observations: string;
  bookingPrice: number;
  breakFastPrice: number;
  inventoryStatus?: 'unconfirmed' | 'check in' | 'check out';
  severity?: 'success' | 'info' | 'warning' | 'danger';
}
