import { Component } from '@angular/core';
import { ChangeDetectorRef, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-circle-chart',
  imports: [ChartModule],
  templateUrl: './circle-chart.html',
  styleUrl: './circle-chart.scss',
})
export class CircleChart implements OnInit {
  value = 7;
  data: any;
  options: any;

  private readonly platformId = inject(PLATFORM_ID);
  private readonly cd = inject(ChangeDetectorRef);

  private readonly chartColors = {
    cyan: {
      500: '--p-cyan-500',
      400: '--p-cyan-400',
      hex: '#00B894',
    },
    orange: {
      500: '--p-orange-500',
      400: '--p-orange-400',
      hex: '#FDCB6E',
    },
    gray: {
      500: '--p-gray-500',
      400: '--p-gray-400',
      hex: '#A4B0BE',
    },
    pink: {
      500: '--p-pink-500',
      400: '--p-pink-400',
      hex: '#E84393',
    },
    blue: {
      500: '--p-blue-500',
      400: '--p-blue-400',
      hex: '#0984E3',
    },
    green: {
      500: '--p-green-500',
      400: '--p-green-400',
      hex: '#00B894',
    },
    teal: {
      500: '--p-teal-500',
      400: '--p-teal-400',
      hex: '#00CEA9',
    },
    lime: {
      500: '--p-lime-500',
      400: '--p-lime-400',
      hex: '#A3CB38',
    },
  };

  readonly textColors = {
    cyan: this.chartColors.cyan.hex,
    orange: this.chartColors.orange.hex,
    gray: this.chartColors.gray.hex,
    pink: this.chartColors.pink.hex,
    blue: this.chartColors.blue.hex,
    green: this.chartColors.green.hex,
  };

  ngOnInit() {
    this.initChart();
  }

  private initChart(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const documentStyle = getComputedStyle(document.documentElement);
    const getColor = (colorVar: string) =>
      documentStyle.getPropertyValue(colorVar);

    this.data = {
      labels: [
        '3 nights',
        '3 nights',
        '4-5 nights',
        '8-14 nights',
        '6-7 nights',
        '8-14 nights',
      ],
      datasets: [
        {
          data: [540, 325, 702, 502, 300, 200],
          backgroundColor: [
            getColor(this.chartColors.cyan[500]),
            getColor(this.chartColors.orange[500]),
            getColor(this.chartColors.gray[500]),
            getColor(this.chartColors.pink[500]),
            getColor(this.chartColors.blue[500]),
            getColor(this.chartColors.green[500]),
          ],
          hoverBackgroundColor: [
            getColor(this.chartColors.cyan[400]),
            getColor(this.chartColors.orange[400]),
            getColor(this.chartColors.gray[400]),
            getColor(this.chartColors.pink[400]),
            getColor(this.chartColors.blue[400]),
            getColor(this.chartColors.green[400]),
          ],
        },
      ],
    };

    this.options = this.getChartOptions();
    this.cd.markForCheck();
  }

  private getChartOptions(): any {
    return {
      cutout: '70%',
      plugins: {
        legend: {
          position: 'right',
          labels: {
            usePointStyle: true,
            boxWidth: 10,
            font: {
              size: 11,
            },
            generateLabels: (chart: any) => {
              const colors = [
                this.chartColors.cyan.hex,
                this.chartColors.orange.hex,
                this.chartColors.gray.hex,
                this.chartColors.pink.hex,
                this.chartColors.blue.hex,
                this.chartColors.green.hex,
              ];
              return chart.data.labels.map((label: string, index: number) => ({
                text: label,
                fontColor: colors[index % colors.length],
                fillStyle: colors[index % colors.length],
                strokeStyle: colors[index % colors.length],
                hidden: false,
                lineWidth: 1,
                pointStyle: 'circle',
              }));
            },
          },
        },
        layout: {
          padding: {
            left: 50,
          },
        },
      },
    };
  }
}
