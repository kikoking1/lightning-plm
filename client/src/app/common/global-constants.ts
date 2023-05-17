import { isDevMode } from '@angular/core';

export const apiURL: string = isDevMode()
  ? 'https://localhost:7057/api/'
  : 'https://lightningplm.com/api/';
