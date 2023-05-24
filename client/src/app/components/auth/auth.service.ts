import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, catchError, throwError } from 'rxjs';
import { apiURL } from 'src/app/common/global-constants';
import { UserLogin } from './login/user-login';
import { NewUser } from './register/new-user';
import { AuthInterceptor } from 'src/app/interceptors/auth.interceptor';
import { JWTToken } from 'src/app/common/models/JWTToken';
import { LoadingService } from 'src/app/common/services/loading.service';
import { ErrorService } from 'src/app/common/services/error.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly authUrl = apiURL + 'Auth';

  private authSubject: Subject<boolean> = new BehaviorSubject<boolean>(
    AuthInterceptor.isLoggedIn()
  );
  authAction$ = this.authSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private loadingService: LoadingService,
    private errorService: ErrorService
  ) {}

  register(user: NewUser) {
    this.loadingService.setLoading(true);
    this.http
      .post<NewUser>(`${this.authUrl}/register`, user, {
        withCredentials: true,
      })
      .pipe(
        catchError((err) => {
          this.loadingService.setLoading(false);
          this.errorService.setError(err.error);
          return throwError(() => new Error(err.error));
        })
      )
      .subscribe((res) => {
        const userLogin: UserLogin = {
          username: user.username,
          password: user.password,
        };
        this.login(userLogin);
      });
  }

  login(userLogin: UserLogin) {
    this.loadingService.setLoading(true);
    this.http
      .post<JWTToken>(`${this.authUrl}/login`, userLogin, {
        withCredentials: true,
      })
      .pipe(
        catchError((err) => {
          this.loadingService.setLoading(false);
          this.errorService.setError(err.error);
          return throwError(() => new Error(err.error));
        })
      )
      .subscribe((res) => {
        AuthInterceptor.accessToken = res.token;
        this.authSubject.next(AuthInterceptor.isLoggedIn());
        this.router.navigate(['/products']);
        this.loadingService.setLoading(false);
      });
  }

  logout() {
    this.loadingService.setLoading(true);
    this.http
      .get(`${this.authUrl}/logout`, { withCredentials: true })
      .pipe(
        catchError((err) => {
          this.loadingService.setLoading(false);
          this.errorService.setError(err.error);
          return throwError(() => new Error(err.error));
        })
      )
      .subscribe(() => {
        AuthInterceptor.accessToken = '';
        this.authSubject.next(AuthInterceptor.isLoggedIn());
        this.router.navigate(['/home']);
        this.loadingService.setLoading(false);
      });
  }

  refresh() {
    this.loadingService.setLoading(true);
    this.http
      .get(`${this.authUrl}/refresh`, { withCredentials: true })
      .pipe(
        catchError((err) => {
          this.loadingService.setLoading(false);
          return throwError(() => new Error(err.error));
        })
      )
      .subscribe((res: any) => {
        if (res?.token) {
          AuthInterceptor.accessToken = res.token;
          this.authSubject.next(AuthInterceptor.isLoggedIn());
        }

        this.loadingService.setLoading(false);
      });
  }
}
