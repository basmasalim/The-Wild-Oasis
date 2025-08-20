// core/services/firebase-error-handler.service.ts
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FirebaseError } from 'firebase/app';

@Injectable({ providedIn: 'root' })
export class FirebaseErrorHandlerService {
  constructor(private messageService: MessageService) {}

  handle(error: unknown) {
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case 'auth/invalid-credential':
          this.messageService.add({ severity: 'error', summary: 'Login Failed', detail: 'Invalid email or password' });
          break;
        case 'auth/email-already-in-use':
          this.messageService.add({ severity: 'warn', summary: 'Signup Error', detail: 'Email is already in use' });
          break;
        default:
          this.messageService.add({ severity: 'error', summary: 'Firebase Error', detail: error.message });
      }
    } else {
      this.messageService.add({ severity: 'error', summary: 'Unknown Error', detail: String(error) });
    }
  }
}
