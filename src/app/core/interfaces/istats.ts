import { StatType } from "../enum/stat-type.enum";

export interface IStats {

    icon: string;             // أيقونة (PrimeIcons)
    color: string;            // لون النص
    bgColor: string;          // لون الخلفية
    label: StatType;          // نوع الـ Stat (Bookings, Sales, CheckIns, Rate)
    value: number | string;   // القيمة (ممكن رقم أو نص زي "72%")

}
