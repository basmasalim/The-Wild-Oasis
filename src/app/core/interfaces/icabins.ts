export interface Icabins {

  name: string;

  cabin: number;
  capacity: any;
  discount: number;
  price: number;
  inventoryStatus: 'nodiscount' | 'indiscount';

  id: string;
  cabinNumber: string;
  capacity: string;
  price: number;
  discount: number | null;
  inventoryStatus: 'discount' | 'nodiscount';

}
