import { Pipe, PipeTransform } from '@angular/core';
import { Discount } from '../../enum/discount.emum';
import { Icabins } from '../../interfaces/icabins';

@Pipe({
    name: 'filterDiscount',
})
export class FilterDiscountPipe implements PipeTransform {
    transform(cabins: Icabins[], filterStatus: Discount | 'all'): Icabins[] {
        if (!cabins) return [];

        if (filterStatus === 'all') {
            return cabins;
        }

        return cabins.filter((cabin) => {
            const hasDiscount = cabin.discount && cabin.discount > 0;
            return filterStatus === Discount.WithDiscount
                ? hasDiscount
                : !hasDiscount;
        });
    }
}