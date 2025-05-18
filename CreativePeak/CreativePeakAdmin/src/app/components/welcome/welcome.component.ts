import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { DetailsSiteService } from '../../services/details-site/details-site.service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    MatIconModule,
  ],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {
  currentYear = new Date().getFullYear();

  portfolios: number = 0;
  users: number = 0;
  projects: number = 0;
  categories: number = 0;

  constructor(private router: Router, private detailsSiteService: DetailsSiteService) { }

  ngOnInit(): void {
    this.detailsSiteService.getUsers().subscribe(count => {
      this.animateCount('portfolios', count);
    });

    this.detailsSiteService.getUsers().subscribe(count => {
      this.animateCount('users', count);
    });

    this.detailsSiteService.getImages().subscribe(data => {
      this.animateCount('projects', data.length);
    });

    this.detailsSiteService.getCategories().subscribe(data => {
      this.animateCount('categories', data.length);
    });
  }

  navigate(path: string): void {
    this.router.navigate([path]);
  }


  animateCount(property: 'portfolios' | 'users' | 'projects' | 'categories', targetValue: number) {
    let current = 0;
    const stepTime = 60;
    const increment = Math.ceil(targetValue / 50);

    const interval = setInterval(() => {
      current += increment;
      if (current >= targetValue) {
        current = targetValue;
        clearInterval(interval);
      }
      this[property] = current;
    }, stepTime);
  }
}
