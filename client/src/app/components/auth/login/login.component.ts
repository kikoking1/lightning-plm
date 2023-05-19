import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { UserLogin } from './user-login';
import { LoadingService } from 'src/app/common/services/loading.service';
import { combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  userLoginForm!: FormGroup;

  vm$ = combineLatest([
    this.authService.errorMessage$,
    this.loadingService.isLoading$,
  ]).pipe(
    map(([errorMessage, isLoading]) => ({
      errorMessage,
      isLoading,
    }))
  );

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
