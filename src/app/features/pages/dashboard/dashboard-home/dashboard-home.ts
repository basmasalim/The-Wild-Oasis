import { Home } from './../../../../core/enum/home.enum';
import { Component, computed, signal } from '@angular/core';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { DAYSOPTIONS_CONSTANTS } from '../../../../core/constants/daysOptions.constants';
import { RecentBox } from '../../../../shared/components/ui/recent-box/recent-box';
import { STATS_BY_DAYS_CONSTANTS } from '../../../../core/constants/stats.constants';
import { CircleChart } from '../../../../shared/components/business/circle-chart/circle-chart';
import { LineChart } from '../../../../shared/components/business/line-chart/line-chart';
import { TodayTable } from '../../../../shared/components/ui/today-table/today-table';
@Component({
  selector: 'app-dashboard-home',
  imports: [
    FormsModule,
    SelectButtonModule,
    RecentBox,
    CircleChart,
    LineChart,
    TodayTable,
  ],
  templateUrl: './dashboard-home.html',
  styleUrl: './dashboard-home.scss',
})
export class DashboardHome {
  daysOptions = DAYSOPTIONS_CONSTANTS;

  filteredStatus = signal<Home>(this.daysOptions[0].value);

  // computed stats based on selected filter
  filteredStats = computed(
    () => STATS_BY_DAYS_CONSTANTS[this.filteredStatus()]
  );

  applyFilter(status: Home): void {
    this.filteredStatus.set(status);
  }

  // today section
  todayData = computed(() => {
    switch (this.filteredStatus()) {
      case Home.LAST7:
        return { type: 'text', value: 'No activity today...' };
      case Home.LAST30:
        return { type: 'component' };
      default:
        return { type: 'text', value: 'No activity today...' };
    }
  });
}
