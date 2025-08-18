import { Component } from '@angular/core';
import { ChangeDetectorRef, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-line-chart',
  imports: [ChartModule],
  templateUrl: './line-chart.html',
  styleUrl: './line-chart.scss',
})
export class LineChart {
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
        labels: ['08 12', '08 13', '08 14', '08 15', '08 16', '08 17', '08 19'],
        datasets: [
          {
            label: 'First Dataset',
            data: [5, 9, 0, 1, 6, 5, 0],
            fill: false,
            tension: 0.4,
            borderColor: documentStyle.getPropertyValue('--p-green-400'),
          },
          {
            label: 'Third Dataset',
            data: [6, 21, 12, 13, 11, 32, 25],
            fill: true,
            borderColor: documentStyle.getPropertyValue('--p-gray-500'),
            tension: 0.4,
            backgroundColor: 'rgba(78, 70, 229, 0.35)',
          },
        ],
      };

      this.options = {
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
          legend: {
            labels: {
              color: textColor,
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
            },
          },
          y: {
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
            },
          },
        },
      };
      this.cd.markForCheck();
    }
  }
}
