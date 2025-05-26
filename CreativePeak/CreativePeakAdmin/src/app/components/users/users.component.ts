import { Component, OnInit } from '@angular/core';
import { User } from '../../modules/user';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../services/users/users.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    MatIconModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private usersService: UsersService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.usersService.getUsers().subscribe(
      data => {
        this.users = data.filter(user => user.fullName !== 'Main admin');
        this.isLoading = false;
      },
      error => {
        console.error('Error loading users:', error);
        this.snackBar.open('Failed to load users', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    );
  }

  addNewUser(): void {
    this.router.navigate(['/addUser']);
  }

  editUser(userId: number): void {
    this.router.navigate(['/addUser', userId]);
  }

  deleteUser(userId: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Deletion',
        message: 'Are you sure you want to delete this user? This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const user = this.users.find(u => u.id === userId);
        if (user?.fullName === 'MAIN ADMIN') {
          this.snackBar.open('Cannot delete MAIN ADMIN', 'Close', { duration: 3000 });
          return;
        }

        this.isLoading = true;
        this.usersService.deleteUser(userId)
          .then(() => {
            this.snackBar.open('User deleted successfully', 'Close', { duration: 3000 });
            this.loadUsers();
            this.isLoading = false;
          })
          .catch((error) => {
            console.error('Error deleting user:', error);
            this.snackBar.open('Failed to delete user', 'Close', { duration: 3000 });
            this.isLoading = false;
          });
      }
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }
}
