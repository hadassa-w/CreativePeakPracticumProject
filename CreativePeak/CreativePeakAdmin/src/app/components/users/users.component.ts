import { Component, OnInit } from '@angular/core';
import { User } from '../../modules/user';
import { DetailsSiteService } from '../../services/details-site/details-site.service';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../services/users/users.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogDeleteUserComponent } from '../dialog-delete-user/dialog-delete-user.component';
import { Router } from '@angular/router';

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
  public users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm: string = '';
  filterRole: string = 'all';
  filterStatus: string = 'all';
  filterLastCreated: boolean = false;
  currentYear: number = new Date().getFullYear();
  selectedUser: any = null;
  showDeleteDialog: boolean = false;
  userToDelete: { id: number, name: string } | null = null;

  constructor(
    public detailsSiteService: DetailsSiteService,
    public user: UsersService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  setSelectedUser(user: any) {
    this.selectedUser = user;
  }

  ngOnInit(): void {
    // Populate with mock data - replace with your actual data service
    this.detailsSiteService.getUsers().subscribe(users => {
      this.users = users;
      this.applyFilters();
    });
  }

  applyFilters(): void {
    this.filteredUsers = this.users.filter(user => {
      // Search filter
      const matchesSearch = !this.searchTerm ||
        user.fullName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.phone.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.address.toLowerCase().includes(this.searchTerm.toLowerCase());

      return matchesSearch;
    });

    // Sort by last created if filter is applied
    if (this.filterLastCreated) {
      this.filteredUsers.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    }
  }

  toggleLastCreatedFilter(): void {
    this.filterLastCreated = !this.filterLastCreated;
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.filterRole = 'all';
    this.filterStatus = 'all';
    this.filterLastCreated = false;
    this.applyFilters();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'active': return 'status-active';
      case 'inactive': return 'status-inactive';
      case 'pending': return 'status-pending';
      default: return '';
    }
  }

  editUser(userId: number, user: User): void {
    // במקום לקרוא לפונקציית editUser ישירות, פשוט נעבור לנתיב של הוספת משתמש עם ID:
    this.router.navigate(['/addUser', userId]);
    // const userToUpdate = this.users.find(user => user.id == userId);
    if (user) {
      this.user.updateUser(userId, user);
    } else {
      console.error('User not found');
    }
  }

  // Method to initiate the delete process - shows the dialog
  confirmDeleteUser(userId: number): void {
    const userToDelete = this.users.find(user => user.id === userId);
    if (!userToDelete) {
      console.error('User not found');
      return;
    }

    // Open the dialog
    this.dialog.open(DialogDeleteUserComponent, {
      width: '400px',
      data: {
        userId: userId,
        userName: userToDelete.fullName,
        onResult: (confirmed: boolean) => {
          if (confirmed) {
            this.executeDeleteUser(userId);
          }
        }
      }
    });
  }

  // Method to actually delete the user after confirmation
  async executeDeleteUser(userId: number): Promise<void> {
    try {
      await this.user.deleteUser(userId);
      console.log(`Deleted user with ID: ${userId}`);

      this.users = this.users.filter(user => user.id !== userId);
      this.filteredUsers = this.filteredUsers.filter(user => user.id !== userId);

      if (this.selectedUser && this.selectedUser.id === userId) {
        this.selectedUser = null;
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }

  navigate(path: string): void {
    this.router.navigate([path]);
  }
}
