import { Component, HostListener, inject, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

interface NavItem {
  name: string;
  path: string;
  icon?: string;
  action?: () => void;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: []
})
export class HeaderComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);

  mobileOpen = false;
  popoverOpen = false;
  popoverAnchor: HTMLElement | null = null;
  currentPath = '';
  drawerWidth = 280;

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  get userName(): string {
    return this.authService.userName || '?';
  }

  get navItems(): NavItem[] {
    return this.isLoggedIn ? this.loggedInNavItems : this.loggedOutNavItems;
  }

  loggedInNavItems: NavItem[] = [
    { name: 'Home', path: '/welcome', icon: 'home' },
    { name: 'Users', path: '/users', icon: 'people' },
    // { name: 'Projects', path: '/projects', icon: 'folder' },
    // { name: 'Categories', path: '/categories', icon: 'category' },
    { name: 'Reports', path: '/reports', icon: 'insert_chart' },
    { name: 'Log Out', path: '/', icon: 'exit_to_app', action: () => this.handleLogOut() },
  ];

  loggedOutNavItems: NavItem[] = [
    { name: 'Home', path: '/', icon: 'home' },
    { name: 'Log In', path: '/logIn', icon: 'login' },
  ];

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.currentPath = event.url;
        }
      });

    this.currentPath = this.router.url;
  }

  toggleDrawer(): void {
    this.mobileOpen = !this.mobileOpen;
  }

  closeDrawer(): void {
    this.mobileOpen = false;
  }

  handleLogOut(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  handleClick(event: MouseEvent): void {
    this.popoverAnchor = event.currentTarget as HTMLElement;
    this.popoverOpen = !this.popoverOpen;
  }

  handleClose(): void {
    this.popoverOpen = false;
  }

  isActive(path: string): boolean {
    return this.currentPath === path;
  }

  navigateTo(item: NavItem): void {
    if (item.action) {
      item.action();
    } else {
      this.router.navigate([item.path]);
    }
    this.closeDrawer();
    this.handleClose();
  }

  getCurrentYear(): number {
    return new Date().getFullYear();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const clickedElement = event.target as HTMLElement;

    if (
      this.popoverOpen &&
      this.popoverAnchor &&
      !this.popoverAnchor.contains(clickedElement)
    ) {
      this.handleClose();
    }
  }
}
