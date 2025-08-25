import { computed, Injectable, signal } from '@angular/core';
import { StatType } from '../../enum/stat-type.enum';
import { IBookings } from '../../interfaces/ibookings';
import { Home } from '../../enum/home.enum';

@Injectable({
  providedIn: 'root'
})
export class Stats {
  // الداتا الخام
  private bookings = signal<IBookings[]>([]);

  // تحميل الداتا (من الـ API أو Firebase)
  loadBookings(data: IBookings[]) {
    this.bookings.set(data);
  }

  // computed: إحصائيات حسب المدة
  stats = computed(() => {
    const data = this.bookings();
    const today = new Date();

    const filterByDays = (days: number) => {
      return data.filter((b) => {
        const created = new Date(b.createdAt);
        const diff = (today.getTime() - created.getTime()) / (1000 * 3600 * 24);
        return diff <= days;
      });
    };

    return {
      [Home.LAST7]: this.buildStats(filterByDays(7)),
      [Home.LAST30]: this.buildStats(filterByDays(30)),
      [Home.LAST90]: this.buildStats(filterByDays(90)),
    };
  });

  // helper: يبني الكروت
  private buildStats(bookings: IBookings[]) {
    return [
      {
        icon: 'pi pi-briefcase',
        color: 'var(--color-blue-700)',
        bgColor: 'var(--color-blue-100)',
        label: StatType.BOOKINGS,
        value: bookings.length,
      },
      {
        icon: 'pi pi-money-bill',
        color: 'var(--color-green-700)',
        bgColor: 'var(--color-green-100)',
        label: StatType.SALES,
        value: '$' + bookings.reduce((sum, b) => sum + (b.bookingPrice + b.breakFastPrice), 0),
      },
      {
        icon: 'pi pi-calendar',
        color: 'var(--color-indigo-700)',
        bgColor: 'var(--color-indigo-100)',
        label: StatType.CheckIns,
        value: bookings.filter((b) => {
          const start = new Date(b.startDate + 'T00:00:00');
          const today = new Date(); // 👈 لازم نعرفه هنا أو بره فوق
          return start.getTime() <= today.getTime();
        }).length


      },
      {
        icon: 'pi pi-chart-line',
        color: 'var(--color-yellow-700)',
        bgColor: 'var(--color-yellow-100)',
        label: StatType.RATE,
        value: Math.round((bookings.filter(b => b.isPaid).length / (bookings.length || 1)) * 100) + '%',
      },
    ];
  }
}
