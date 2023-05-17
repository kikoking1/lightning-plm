import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, catchError } from 'rxjs';
import { apiURL } from 'src/app/common/global-constants';
import { UserLogin } from './login/user-login';
import { NewUser } from './register/new-user';
import { AuthInterceptor } from 'src/app/interceptors/auth.interceptor';
import { JWTToken } from 'src/app/common/models/JWTToken';

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
      .subscribe((user) => {
        console.log(user);
        this.router.navigate(['/auth/login']);
      });
  }

  login(userLogin: UserLogin) {
    this.http
      .post<JWTToken>(`${this.authUrl}/login`, userLogin)
      .subscribe((res) => {
        AuthInterceptor.accessToken = res.token;
        this.router.navigate(['/products']);
      });
  }
}
