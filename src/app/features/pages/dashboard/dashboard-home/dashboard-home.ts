import { Home } from './../../../../core/enum/home.enum';
import { Component, signal } from '@angular/core';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { DAYSOPTIONS_CONSTANTS } from '../../../../core/constants/daysOptions.constants';
import { RecentBox } from '../../../../shared/components/ui/recent-box/recent-box';
import { Starts_CONSTANTS } from '../../../../core/constants/stats.constants';
import { CircleChart } from "../../../../shared/components/business/circle-chart/circle-chart";
import { TodayTable } from "../../../../shared/components/ui/today-table/today-table";
import { LineChart } from "../../../../shared/components/business/line-chart/line-chart";
@Component({
  selector: 'app-dashboard-home',
  imports: [FormsModule, SelectButtonModule, RecentBox, CircleChart, TodayTable, LineChart],
  templateUrl: './dashboard-home.html',
  styleUrl: './dashboard-home.scss',
})
export class DashboardHome {
  first = 0;

  daysOptions = DAYSOPTIONS_CONSTANTS;
  stats = signal(Starts_CONSTANTS);

  filteredStatus: Home | '' = this.daysOptions[0].value;

  applyFilter(status: Home | ''): void {
    this.filteredStatus = status;
    this.first = 0;
  }


}
