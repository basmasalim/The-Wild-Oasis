import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Authintication } from '../../auth/services/authintication/authintication';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const auth = inject(Authintication);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    if (localStorage.getItem('loggedIn') === 'true' || auth.isLogged()) {
      return true;

    } else {
      router.navigate(['/']);
      return false;
    }
  }

  return true;
};
