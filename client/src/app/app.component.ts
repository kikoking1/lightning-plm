import { Component } from '@angular/core';
import { AuthService } from './components/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'lightning-plm';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.refresh();
  }
}
