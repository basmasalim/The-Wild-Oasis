export interface Icabins {
  createdAt: string;        // تاريخ الإنشاء (مثلاً "2025-08-10")
  description: string;      // وصف الكبينة
  discount: number;         // الخصم
  maxCapacity: number;      // السعة القصوى
  name: string;             // اسم الكبينة (مثلاً "008")
  regularPrice: number;     // السعر العادي
  id?: string;
}
