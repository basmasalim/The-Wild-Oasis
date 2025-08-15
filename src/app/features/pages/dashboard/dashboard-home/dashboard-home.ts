import { Component } from '@angular/core';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef,  effect, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-dashboard-home',
  imports: [FormsModule ,SelectButtonModule,ChartModule],
  templateUrl: './dashboard-home.html',
  styleUrl: './dashboard-home.scss',
  
})
export class DashboardHome implements OnInit {
      // frist data 
    stateOptions = [
    { label: 'Last 7 days', value: 7 },
    { label: 'Last 30 days', value: 30 },
    { label: ' Last 90 days', value: 90 }
  ];

  value = 7; 
    // end
    // start night and sales data 
    //  لما الداتا تيجي مكانها تحت
    // لما تيجي تدخل داتا اعمل نسخه كمان من الvar  علشان الي تحت شفالين علي اتنين graph
    data: any;
    options: any;
 platformId = inject(PLATFORM_ID);
    constructor(private cd: ChangeDetectorRef) {}
    ngOnInit() {
        this.initChart();
    }  initChart() {
        if (isPlatformBrowser(this.platformId)) {
            const documentStyle = getComputedStyle(document.documentElement);
            // color for text 
            const textColor = documentStyle.getPropertyValue('--color-grey-100');
            this.data = {
                labels: ['3 nights', '3 nights', '4-5  nights','8-14 nights'],
                datasets: [
                    {
                        data: [540, 325, 702,502],
                        backgroundColor: [documentStyle.getPropertyValue('--p-cyan-500'), documentStyle.getPropertyValue('--p-orange-500'), documentStyle.getPropertyValue('--p-gray-500')],
                        hoverBackgroundColor: [documentStyle.getPropertyValue('--p-cyan-400'), documentStyle.getPropertyValue('--p-orange-400'), documentStyle.getPropertyValue('--p-gray-400')]
                    }
                ]
            };
            this.options = {
           plugins: {
                    legend: {
                        labels: {
                            usePointStyle: true,
                            // colors for text 
                            color: textColor
                        }
                    }
                }
            };
            this.cd.markForCheck()
        }
    }
}    



