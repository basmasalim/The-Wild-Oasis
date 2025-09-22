import { computed, Injectable, signal, WritableSignal } from '@angular/core';
import { IUser } from '../../interfaces/iuser';

@Injectable({
  providedIn: 'root'
})
export class Admin {
  // الـ signal الأساسي
  userAccount: WritableSignal<IUser> = signal({} as IUser);

  // ✅ computed علشان تجيب الصورة
  userImage = computed(() => this.userAccount().image);

  // ✅ computed علشان تجيب الاسم
  userName = computed(() => this.userAccount().fullName);

  // دالة تحديث
  setUserAccount(data: IUser) {
    this.userAccount.set(data);
    localStorage.setItem('userAccount', JSON.stringify(data));
  }

  // دالة تحميل من localStorage
  loadUserFromStorage() {
    const saved = localStorage.getItem('userAccount');
    if (saved) {
      this.userAccount.set(JSON.parse(saved));
    } else {
      // ✅ fallback لو مفيش تخزين
      this.userAccount.set({
        fullName: 'Admin',
        email: 'admin@example.com',
        image: '/images/WhatsApp Image 2025-06-18 at 14.11.06_a5cd79d5.jpg'
      } as IUser);
    }
  }
}
