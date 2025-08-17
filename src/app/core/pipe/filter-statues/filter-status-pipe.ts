import { Pipe, PipeTransform } from '@angular/core';
import { Iguest } from '../../interfaces/iguest';

@Pipe({
  name: 'filterStatus',
})
export class FilterStatusPipe implements PipeTransform {
  transform(guests: Iguest[], status: string): Iguest[] {
    if (!guests) return [];
    if (!status) return guests;
    return guests.filter((guest) => guest.inventoryStatus === status);
  }
}
