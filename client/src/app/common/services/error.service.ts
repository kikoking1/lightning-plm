import { Injectable } from '@angular/core';
import { ErrorMessage } from '../interfaces/error-message';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  private errorSubject: Subject<ErrorMessage> = new Subject<ErrorMessage>();
  error$: Observable<ErrorMessage> = this.errorSubject.asObservable();

  constructor() {}

  setError(errorMessage: ErrorMessage | any) {
    if (!errorMessage.hasOwnProperty('errorMessage')) {
      this.errorSubject.next({
        errorMessage: 'An unknown error has occurred.',
      } as ErrorMessage);
    } else {
      this.errorSubject.next(errorMessage as ErrorMessage);
    }
  }
}
