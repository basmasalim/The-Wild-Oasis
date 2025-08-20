import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize, tap } from 'rxjs/operators';
import { Loading } from '../../services/loading/loading';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
 const loadingService = inject(Loading);

  loadingService.show();

  return next(req).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        // اول ما يجي الريسبونس النهائي
        loadingService.hide();
      }
    }),
    finalize(() => {
      // في حالة الـ error أو أي closing للـ stream
      loadingService.hide();
    })
  );
};
