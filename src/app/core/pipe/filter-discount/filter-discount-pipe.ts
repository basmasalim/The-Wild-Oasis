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
        // ✅ الفرز
        filtered.sort((a, b) => {
            const nameA = a?.name ?? '';
            const nameB = b?.name ?? '';

            switch (sortOption) {
                case 'name-asc':
                    return nameA.localeCompare(nameB);
                case 'name-desc':
                    return nameB.localeCompare(nameA);
                case 'regularPrice-asc':
                    return (a?.regularPrice ?? 0) - (b?.regularPrice ?? 0);
                case 'regularPrice-desc':
                    return (b?.regularPrice ?? 0) - (a?.regularPrice ?? 0);
                case 'capacity-asc':
                    return (a?.maxCapacity ?? 0) - (b?.maxCapacity ?? 0);
                case 'capacity-desc':
                    return (b?.maxCapacity ?? 0) - (a?.maxCapacity ?? 0);
                default:
                    return 0;
            }
        });

        return filtered;
    }
}
