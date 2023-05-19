import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { UserLogin } from './user-login';
import { LoadingService } from 'src/app/common/services/loading.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  userLoginForm!: FormGroup;
  errorMessage$ = this.authService.errorMessage$;
  isLoading$ = this.loadingService.isLoading$;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.userLoginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=[^0-9]*[0-9]).{8,24}'
          ),
        ],
      ],
    });
  }

  save(): void {
    this.authService.login(this.userLoginForm.value as UserLogin);
  }
}
