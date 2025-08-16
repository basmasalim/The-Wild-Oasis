export interface Icabins {
  id: string;
  cabinNumber: string;
  capacity: string;
  price: number;
  discount: number | null;
  inventoryStatus: 'discount' | 'nodiscount';
}
