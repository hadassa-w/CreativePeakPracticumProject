import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  currentYear = new Date().getFullYear();

  loginForm: FormGroup;
  isLoading = false;
  loginError = '';

  constructor(
    private router: Router,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.loginError = '';

      setTimeout(() => {
        this.isLoading = false;
        this.router.navigate(['/admin/dashboard']);
      }, 1500);
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  navigate(path: string): void {
    this.router.navigate([path]);
  }

}
