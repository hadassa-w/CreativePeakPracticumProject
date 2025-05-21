import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { User } from '../../modules/user';
import { UsersService } from '../../services/users/users.service';
import { DetailsSiteService } from '../../services/details-site/details-site.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-edit-user',
  standalone: true,
  imports: [
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatSnackBarModule
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
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private usersService: UsersService,
    private detailsSiteService: DetailsSiteService,
    private snackBar: MatSnackBar
  ) {
    // Initialize form without password field - will add it later if needed
    this.userForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s\-\(\)]{8,15}$/)]],
      address: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.userId = +params['id'];
        this.loadUserData(this.userId);
      } else {
        // Add password field only when creating a new user
        this.userForm.addControl('password', this.fb.control('', [
          Validators.required, 
          Validators.minLength(6)
        ]));
      }
    });
  }

  async loadUserData(userId: number): Promise<void> {
    this.isLoading = true;
    try {
      // Since your getUserById doesn't return the user data directly, we need to fetch users
      const users = await this.detailsSiteService.getUsers().toPromise();
      const user = users?.find(u => u.id === userId);
      
      if (user) {
        this.userForm.patchValue({
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          address: user.address
        });
      } else {
        this.snackBar.open('User not found', 'Close', { duration: 3000 });
        this.router.navigate(['/users']);
      }
    } catch (error) {
      console.error('Error loading user:', error);
      this.snackBar.open('Error loading user data', 'Close', { duration: 3000 });
    } finally {
      this.isLoading = false;
    }
  }

  async onSubmit(): Promise<void> {
    this.submitAttempted = true;
    
    if (this.userForm.invalid) {
      // Trigger validation on all fields
      Object.keys(this.userForm.controls).forEach(key => {
        const control = this.userForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    
    try {
      if (this.isEditMode && this.userId) {
        // For edit mode - use User object (without password)
        const userData: User = {
          id: this.userId,
          fullName: this.userForm.value.fullName,
          email: this.userForm.value.email,
          phone: this.userForm.value.phone,
          address: this.userForm.value.address,
          createdAt: new Date(), // This should be preserved from the original user, but using current date as fallback
          updatedAt: new Date()
        };
        
        await this.usersService.updateUser(this.userId, userData);
        this.snackBar.open('User updated successfully', 'Close', { duration: 3000 });
      } else {
        // For create mode - use CreateUser object (with password)
        const createUserData = {
          id:0,
          fullName: this.userForm.value.fullName,
          email: this.userForm.value.email,
          phone: this.userForm.value.phone,
          address: this.userForm.value.address,
          password: this.userForm.value.password,
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
    // Convert camelCase to Title Case with spaces
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