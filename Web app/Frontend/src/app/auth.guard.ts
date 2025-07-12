import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const isLoggedIn = localStorage.getItem('login');

  if (isLoggedIn === '1') {
    return true; // المستخدم مسجل دخول
  } else {
    return router.parseUrl('/login'); // إعادة التوجيه بطريقة آمنة
  }
};
