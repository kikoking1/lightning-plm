import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, tap } from 'rxjs';
import { apiURL } from 'src/app/common/global-constants';
import { UserLogin } from './login/user-login';
import { NewUser } from './register/new-user';
import { AuthInterceptor } from 'src/app/interceptors/auth.interceptor';
import { JWTToken } from 'src/app/common/models/JWTToken';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly authUrl = apiURL + 'Auth';

  private authSubject: Subject<boolean> = new BehaviorSubject<boolean>(
    AuthInterceptor.isLoggedIn()
  );
  authAction$ = this.authSubject.asObservable();

  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  register(user: NewUser) {
    this.http
      .post<NewUser>(`${this.authUrl}/register`, user, {
        withCredentials: true,
      })
      .subscribe((user) => {
        console.log(user);
        this.router.navigate(['/auth/login']);
      });
  }

  login(userLogin: UserLogin) {
    this.http
      .post<JWTToken>(`${this.authUrl}/login`, userLogin, {
        withCredentials: true,
      })
      .subscribe((res) => {
        AuthInterceptor.accessToken = res.token;
        this.authSubject.next(AuthInterceptor.isLoggedIn());
        this.router.navigate(['/products']);
      });
  }

  logout() {
    this.http
      .get(`${this.authUrl}/logout`, { withCredentials: true })
      .subscribe(() => {
        AuthInterceptor.accessToken = '';
        this.authSubject.next(AuthInterceptor.isLoggedIn());
        this.router.navigate(['/auth/login']);
      });
  }

  refresh() {
    this.http
      .get(`${this.authUrl}/refresh`, { withCredentials: true })
      .subscribe((res: any) => {
        AuthInterceptor.accessToken = res.token;
        this.authSubject.next(AuthInterceptor.isLoggedIn());
      });
  }
}
