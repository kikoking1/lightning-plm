import { Component } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AuthInterceptor } from 'src/app/interceptors/auth.interceptor';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  mobileNavOpen: boolean = false;
  constructor(private authService: AuthService) {}

  navLinks$: Observable<Record<string, string>[]> =
    this.authService.authAction$.pipe(map(() => this.getNavLinks()));

  ngOnInit() {}

  getNavLinks() {
    const navLinks: Record<string, string>[] = [];
    navLinks.push({ path: '/home', label: 'Home' });

    if (AuthInterceptor.isLoggedIn()) {
      navLinks.push(
        { path: '/products', label: 'Products' },
        { path: '#', label: 'Logout' }
      );
    } else {
      navLinks.push(
        { path: '/auth/login', label: 'Login' },
        { path: '/auth/register', label: 'Register' }
      );
    }
    return navLinks;
  }

  logout() {
    this.authService.logout();
  }
}
