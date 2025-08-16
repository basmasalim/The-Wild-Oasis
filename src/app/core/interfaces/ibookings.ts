export interface IBookings {
    cabinId: number;
    createdAt: string;      // تاريخ (string في شكل yyyy-MM-dd)
    startDate: string;      // تاريخ بداية
    endDate: string;        // تاريخ نهاية
    guestEmail: string;     // ايميل النزيل
    guestId: number;        // ID النزيل
    guestName: string;      // اسم النزيل
    hasBreakfast: boolean;  // هل معاه فطار؟
    isPaid: boolean;        // مدفوع ولا لا؟
    numGuests: number;      // عدد الضيوف
    observations: string;   // ملاحظات
}
