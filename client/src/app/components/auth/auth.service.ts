import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, catchError } from 'rxjs';
import { apiURL } from 'src/app/common/global-constants';
import { UserLogin } from './login/user-login';
import { NewUser } from './register/new-user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authUrl = apiURL + 'Auth';

  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  register(user: NewUser) {
    this.http
      .post<NewUser>(`${this.authUrl}/register`, user)
      .pipe(
        catchError((err) => {
          this.errorMessageSubject.next(err);
          return [];
        })
      )
      .subscribe((user) => {
        console.log(user);
        this.router.navigate(['/auth/login']);
      });
  }

  login(userLogin: UserLogin) {
    this.http
      .post<UserLogin>(`${this.authUrl}/login`, userLogin)
      .pipe(
        catchError((err) => {
          this.errorMessageSubject.next(err);
          return [];
        })
      )
      .subscribe((res) => {
        console.log(res);
        this.router.navigate(['/products']);
      });
  }
}
