export interface Icabins {
  name: string;

  cabin: number;
  capacity: any;
  discount: number;
  price: number;
  inventoryStatus: 'nodiscount' | 'indiscount';
}
