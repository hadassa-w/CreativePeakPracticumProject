import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { User } from '../../modules/user';
import { UsersService } from '../../services/users/users.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-edit-user',
  standalone: true,
  imports: [
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatSnackBarModule,
  ],
  templateUrl: './add-edit-user.component.html',
  styleUrl: './add-edit-user.component.css'
})
export class AddEditUserComponent implements OnInit {
  userForm: FormGroup;
  isEditMode: boolean = false;
  userId: number | null = null;
  isLoading: boolean = false;
  submitAttempted: boolean = false;
  showPassword: boolean = false;
  passwordStrength: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private usersService: UsersService,
    private snackBar: MatSnackBar
  ) {
    this.userForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s\-\(\)]{8,15}$/)]],
      address: [''],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.userId = +params['id'];
        this.loadUserData(this.userId);
      } else {
        this.userForm.addControl('password', this.fb.control('', [
          Validators.required,
          Validators.minLength(6)
        ]));
        
        this.userForm.get('password')?.valueChanges.subscribe(value => {
          this.checkPasswordStrength(value);
        });
      }
    });
  }

  async loadUserData(userId: number): Promise<void> {
    this.isLoading = true;
    try {
      const users = await this.usersService.getUsers().toPromise();
      const user = users?.find(u => u.id === userId);

      if (user) {
        this.userForm.patchValue({
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          address: user.address,
          isActive: user.isActive
        });
      } else {
        this.snackBar.open('User not found', 'Close', { duration: 3000 },);
        this.router.navigate(['/users']);
      }
    } catch (error) {
      console.error('Error loading user:', error);
      this.snackBar.open('Error loading user data', 'Close', { duration: 3000 });
    } finally {
      this.isLoading = false;
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  checkPasswordStrength(password: string): void {
    if (!password) {
      this.passwordStrength = '';
      return;
    }

    let strength = 0;
    const checks = {
      hasLower: /[a-z]/.test(password),
      hasUpper: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
      hasMinLength: password.length >= 6,
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    // Count passed checks
    strength = Object.values(checks).filter(Boolean).length;

    if (strength < 2 || !checks.hasMinLength) {
      this.passwordStrength = 'weak';
    } else if (strength < 4) {
      this.passwordStrength = 'medium';
    } else {
      this.passwordStrength = 'strong';
    }
  }

  getPasswordStrengthText(): string {
    switch (this.passwordStrength) {
      case 'weak': return 'Weak - Add uppercase, numbers, or special characters';
      case 'medium': return 'Medium - Good, but could be stronger';
      case 'strong': return 'Strong - Excellent password!';
      default: return '';
    }
  }

  async onSubmit(): Promise<void> {
    this.submitAttempted = true;

    if (this.userForm.invalid) {
      Object.keys(this.userForm.controls).forEach(key => {
        const control = this.userForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;

    try {
      if (this.isEditMode && this.userId) {
        const userData: User = {
          id: this.userId,
          fullName: this.userForm.value.fullName,
          email: this.userForm.value.email,
          phone: this.userForm.value.phone,
          address: this.userForm.value.address,
          isActive: this.userForm.value.isActive,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        await this.usersService.updateUser_Main(this.userId, userData);
        this.snackBar.open('User updated successfully', 'Close', { duration: 3000 });
      } else {
        const createUserData = {
          id: 0,
          fullName: this.userForm.value.fullName,
          email: this.userForm.value.email,
          phone: this.userForm.value.phone,
          address: this.userForm.value.address,
          password: this.userForm.value.password,
          isActive: this.userForm.value.isActive,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        await this.usersService.createUser(createUserData);
        this.snackBar.open('User created successfully', 'Close', { duration: 3000 });
      }

      this.router.navigate(['/users']);
    } catch (error) {
      console.error('Error saving user:', error);
      this.snackBar.open('Error saving user data', 'Close', { duration: 3000 });
    } finally {
      this.isLoading = false;
    }
  }

  getFieldError(fieldName: string): string {
    const control = this.userForm.get(fieldName);

    if (control?.errors && (control.touched || this.submitAttempted)) {
      if (control.errors['required']) {
        return `${this.formatFieldName(fieldName)} is required`;
      }
      if (control.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (control.errors['minlength']) {
        const requiredLength = control.errors['minlength'].requiredLength;
        if (fieldName === 'password') {
          return `Password must be at least ${requiredLength} characters`;
        }
        return `${this.formatFieldName(fieldName)} must be at least ${requiredLength} characters`;
      }
      if (control.errors['pattern']) {
        return 'Please enter a valid phone number';
      }
    }

    return '';
  }

  formatFieldName(fieldName: string): string {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  }

  hasError(fieldName: string): boolean {
    const control = this.userForm.get(fieldName);
    return !!(control?.invalid && (control.touched || this.submitAttempted));
  }

  cancelEdit(): void {
    this.router.navigate(['/users']);
  }
}