import { Component } from '@angular/core';
import { AuthService } from './components/auth/auth.service';
import { LoadingService } from './common/services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'lightning-plm';

  isLoading$ = this.LoadingService.isLoading$;

  constructor(
    private authService: AuthService,
    private LoadingService: LoadingService
  ) {}

  ngOnInit() {
    this.authService.refresh();
  }
}
