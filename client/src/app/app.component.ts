import { Component } from '@angular/core';
import { AuthService } from './components/auth/auth.service';
import { LoadingService } from './common/services/loading.service';
import { Observable } from 'rxjs';
import { ErrorMessage } from './common/interfaces/error-message';
import { ErrorService } from './common/services/error.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isLoading$ = this.LoadingService.isLoading$;
  error$: Observable<ErrorMessage> = this.errorService.error$;

  constructor(
    private authService: AuthService,
    private LoadingService: LoadingService,
    private errorService: ErrorService
  ) {}

  ngOnInit() {
    this.authService.refresh();
  }

  setErrorClosed() {
    this.errorService.setError({ errorMessage: '' });
  }
}
