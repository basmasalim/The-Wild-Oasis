import { Pipe, PipeTransform } from '@angular/core';
import { Discount } from '../../enum/discount.emum';
import { Icabins } from '../../interfaces/icabins';

@Pipe({
    name: 'filterDiscount',
})
export class FilterDiscountPipe implements PipeTransform {
    transform(
        cabins: Icabins[],
        filterStatus: Discount | 'all',
        sortOption: string = 'name-asc'
    ): Icabins[] {
        if (!cabins) return [];

        let filtered = [...cabins];

        // ✅ فلترة الخصم
        if (filterStatus !== 'all') {
            filtered = filtered.filter((cabin) => {
                const hasDiscount = cabin.discount && cabin.discount > 0;
                return filterStatus === Discount.WithDiscount ? hasDiscount : !hasDiscount;
            });
        }

        // ✅ الفرز
        filtered.sort((a, b) => {
            switch (sortOption) {
                case 'name-asc':
                    return a.name.localeCompare(b.name);
                case 'name-desc':
                    return b.name.localeCompare(a.name);
                case 'regularPrice-asc':
                    return a.regularPrice - b.regularPrice;
                case 'regularPrice-desc':
                    return b.regularPrice - a.regularPrice;
                case 'capacity-asc':
                    return a.maxCapacity - b.maxCapacity;
                case 'capacity-desc':
                    return b.maxCapacity - a.maxCapacity;
                default:
                    return 0;
            }
        });

        return filtered;
    }
}
