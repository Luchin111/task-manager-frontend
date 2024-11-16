import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  form: FormGroup;
  error: string | null = null;

  constructor(private authService: AuthService, private router: Router) {
    this.form = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }



  login(): void {
    if (this.form.valid) {
      this.authService
        .login(this.form.value)
        .subscribe({
          next: (response) => {
            this.authService.saveToken(response.token);
            this.router.navigate(['/tasks']);
          },
          error: (err) => {
            this.error = 'Invalid username or password.';
          },
        });
    } else {
      this.error = 'Please fill in all fields correctly.';
    }
  }
}


