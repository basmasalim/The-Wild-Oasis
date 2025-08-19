import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-line-chart',
  imports: [ChartModule],
  templateUrl: './line-chart.html',
  styleUrl: './line-chart.scss',
})
export class LineChart implements OnInit {
  value = 7;
  data: any;
  options: any;

  private readonly platformId = inject(PLATFORM_ID);
  private readonly cd = inject(ChangeDetectorRef);

  ngOnInit() {
    this.initChart();
  }

  initChart() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--p-text-color');
      const textColorSecondary = documentStyle.getPropertyValue(
        '--p-text-muted-color'
      );
      const surfaceBorder = documentStyle.getPropertyValue(
        '--p-content-border-color'
      );

      this.data = {
        labels: ['08 13', '08 14', '08 15', '08 16', '08 17', '08 18', '08 19'],
        datasets: [
          {
            label: 'Sales',
            data: [2000, 5000, 2000, 8000, 2000, 11000, 12000],
            fill: true,
            tension: 0.4,
            borderColor: '#4338CA',
            backgroundColor: 'rgba(67, 56, 202, 0.2)',
            pointBackgroundColor: '#4338CA',
            pointBorderColor: '#ffffff',
            pointHoverBackgroundColor: '#ffffff',
            pointHoverBorderColor: '#4338CA',
            pointRadius: 4,
            pointHoverRadius: 6,
          },
          {
            label: 'Dataset',
            data: [0, 200, 500, 500, 200, 500, 0],
            fill: true,
            tension: 0.4,
            backgroundColor: '#07dd0745',

            borderColor: documentStyle.getPropertyValue('--p-green-400'),
          },
        ],
      };

      this.options = {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: true,
            mode: 'index',
            intersect: false,
            backgroundColor: '#4338CA',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            borderColor: '#4338CA',
            borderWidth: 1,
          },
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary,
              font: {
                size: 11,
              },
            },
            grid: {
              display: false,
            },
          },
          y: {
            min: 0,
            max: 12000,
            ticks: {
              stepSize: 3000,
              color: textColorSecondary,
              callback: function (value: any) {
                return '$' + value.toLocaleString();
              },
              font: {
                size: 11,
              },
            },
            grid: {
              color: surfaceBorder,
              drawBorder: false,
            },
          },
        },
        elements: {
          line: {
            borderWidth: 2,
          },
        },
      };
      this.cd.markForCheck();
    }
  }
}
