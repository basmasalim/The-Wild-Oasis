export interface Iguest {
  name: string;
  image: string;
  price: number;
  category: number;
  date: string;
  inventoryStatus: 'unconfirmed' | 'checkedin' | 'checkedout';
  userEmail: string;
  userRegDate: string;
  userRegTime: string;
}
