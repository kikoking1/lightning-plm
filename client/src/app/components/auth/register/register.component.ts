import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { NewUser } from './new-user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  userRegisterForm!: FormGroup;
  errorMessage$ = this.authService.errorMessage$;

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {
    this.userRegisterForm = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
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
    this.authService.register(this.userRegisterForm.value as NewUser);
  }
}
