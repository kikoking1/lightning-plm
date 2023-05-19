import { Component } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AuthService } from 'src/app/components/auth/auth.service';
import { AuthInterceptor } from 'src/app/interceptors/auth.interceptor';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  constructor(private authService: AuthService) {}

  notLoggedIn$: Observable<boolean> = this.authService.authAction$.pipe(
    map(() => {
      return !AuthInterceptor.isLoggedIn();
    })
  );
}
