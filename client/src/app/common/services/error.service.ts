import { Injectable } from '@angular/core';
import { ErrorMessage } from '../interfaces/error-message';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  private errorSubject: BehaviorSubject<ErrorMessage> =
    new BehaviorSubject<ErrorMessage>({ errorMessage: '' } as ErrorMessage);
  error$: Observable<ErrorMessage> = this.errorSubject.asObservable();

  constructor() {}

  setError(errorMessage: ErrorMessage | any): void {
    if (!errorMessage.hasOwnProperty('errorMessage')) {
      this.errorSubject.next({
        errorMessage: 'An unknown error has occurred.',
      } as ErrorMessage);
    } else {
      this.errorSubject.next(errorMessage as ErrorMessage);
    }
  }
}
