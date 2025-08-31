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
    }
  }
}
