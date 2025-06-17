import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatError } from '@angular/material/form-field'; // לא חובה להוסיף בנפרד, נכלל ב-MatFormFieldModule

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatError,
    ReactiveFormsModule,
  ],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.css'
})
export class LogInComponent {
loginForm: FormGroup;
  showPassword = false;
  fieldErrors: { username?: string; password?: string } = {};
  generalError = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  async handleLogin(): Promise<void> {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      return;
    }

    this.loading = true;
    const { username, password } = this.loginForm.value;

    try {
      const response: any = await this.http.post('https://creativepeak-api.onrender.com/api/Auth/LoginAdmin', {
        UserName: username,
        Password: password
      }).toPromise();

      const token = response.token;
      const fullName = response.user.fullName;

      this.authService.login(fullName,token);
      
      this.fieldErrors = {};
      this.generalError = '';
      this.router.navigate(['/welcome']);
    } catch (error) {
      console.error('Login error:', error);
      this.generalError = 'The username or password is incorrect.';
    } finally {
      this.loading = false;
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
}
