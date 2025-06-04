import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../services/reports/reports.service';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { ReportData } from '../../modules/report';
import { BaseChartDirective } from 'ng2-charts';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [BaseChartDirective, MatIconModule, CommonModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit {
  chartData: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };
  chartType: ChartType = 'bar';
  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        backgroundColor: 'rgba(103, 58, 183, 0.9)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: '#673AB7',
        borderWidth: 1,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(103, 58, 183, 0.1)'
        },
        ticks: {
          color: '#666'
        }
      },
      x: {
        grid: {
          color: 'rgba(103, 58, 183, 0.1)'
        },
        ticks: {
          color: '#666'
        }
      }
    }
  };

  isLoading: boolean = false;
  reportData: ReportData[] = [];

  constructor(
    private reportService: ReportsService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.loadReports();
  }

  loadReports(): void {
    this.isLoading = true;
    this.reportService.getMonthlyReport().subscribe({
      next: (data: ReportData[]) => {
        this.reportData = data;
        this.setupChart(data);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading reports:', error);
        this.snackBar.open('Failed to load reports', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  setupChart(data: ReportData[]): void {
    const labels = data.map(d => d.month);
    const userData = data.map(d => d.newUsers);
    const portfolioData = data.map(d => d.newPortfolios);

    this.chartData = {
      labels,
      datasets: [
        {
          data: userData,
          label: 'New Users',
          backgroundColor: 'rgba(103, 58, 183, 0.8)',
          borderColor: '#673AB7',
          borderWidth: 2,
          borderRadius: 4,
        },
        {
          data: portfolioData,
          label: 'New Portfolios',
          backgroundColor: 'rgba(141, 112, 191, 0.8)',
          borderColor: '#7E57C2',
          borderWidth: 2,
          borderRadius: 4,
        }
      ]
    };
  }

  refreshReports(): void {
    this.loadReports();
  }

  changeChartType(type: ChartType): void {
    this.chartType = type;
  }

  getTotalUsers(): number {
    return this.reportData.reduce((sum, data) => sum + data.newUsers, 0);
  }

  getTotalPortfolios(): number {
    return this.reportData.reduce((sum, data) => sum + data.newPortfolios, 0);
  }
}