export interface Icabins {
  cabin: number;
  capacity: string;
  discount: number;
  price: number;
  inventoryStatus: 'nodiscount' | 'indiscount';
}
