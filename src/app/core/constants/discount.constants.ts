import { Discount } from '../enum/discount.emum';

export const DISCOUNT_CONSTANTS = [
  { label: 'All', value: 'all' as const },
  { label: 'No discount', value: Discount.NoDiscount },
  { label: 'With discount', value: Discount.WithDiscount },
];
