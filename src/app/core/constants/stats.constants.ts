import { inject } from '@angular/core';
import { Home } from '../enum/home.enum';
import { StatType } from '../enum/stat-type.enum';

export const STATS_BY_DAYS_CONSTANTS: Record<Home, any[]> = {

    [Home.LAST7]: [
        {
            icon: 'pi pi-briefcase',
            color: 'var(--color-blue-700)',
            bgColor: 'var(--color-blue-100)',
            label: StatType.BOOKINGS,
            value: 8,
        },
        {
            icon: 'pi pi-money-bill',
            color: 'var(--color-green-700)',
            bgColor: 'var(--color-green-100)',
            label: StatType.SALES,
            value: '$12,500.00',
        },
        {
            icon: 'pi pi-calendar',
            color: 'var(--color-indigo-700)',
            bgColor: 'var(--color-indigo-100)',
            label: StatType.CheckIns,
            value: 3,
        },
        {
            icon: 'pi pi-chart-line',
            color: 'var(--color-yellow-700)',
            bgColor: 'var(--color-yellow-100)',
            label: StatType.RATE,
            value: '72%',
        },
    ],

    [Home.LAST30]: [
        {
            icon: 'pi pi-briefcase',
            color: 'var(--color-blue-700)',
            bgColor: 'var(--color-blue-100)',
            label: StatType.BOOKINGS,
            value: 20,
        },
        {
            icon: 'pi pi-money-bill',
            color: 'var(--color-green-700)',
            bgColor: 'var(--color-green-100)',
            label: StatType.SALES,
            value: '$33,285.00',
        },
        {
            icon: 'pi pi-calendar',
            color: 'var(--color-indigo-700)',
            bgColor: 'var(--color-indigo-100)',
            label: StatType.CheckIns,
            value: 7,
        },
        {
            icon: 'pi pi-chart-line',
            color: 'var(--color-yellow-700)',
            bgColor: 'var(--color-yellow-100)',
            label: StatType.RATE,
            value: '68%',
        },
    ],

    [Home.LAST90]: [
        {
            icon: 'pi pi-briefcase',
            color: 'var(--color-blue-700)',
            bgColor: 'var(--color-blue-100)',
            label: StatType.BOOKINGS,
            value: 50,
        },
        {
            icon: 'pi pi-money-bill',
            color: 'var(--color-green-700)',
            bgColor: 'var(--color-green-100)',
            label: StatType.SALES,
            value: '$98,120.00',
        },
        {
            icon: 'pi pi-calendar',
            color: 'var(--color-indigo-700)',
            bgColor: 'var(--color-indigo-100)',
            label: StatType.CheckIns,
            value: 21,
        },
        {
            icon: 'pi pi-chart-line',
            color: 'var(--color-yellow-700)',
            bgColor: 'var(--color-yellow-100)',
            label: StatType.RATE,
            value: '75%',
        },
    ],
};
