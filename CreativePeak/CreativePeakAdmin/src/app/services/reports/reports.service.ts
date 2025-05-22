import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReportData } from '../../modules/report';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private http: HttpClient) {}

  getMonthlyReport(): Observable<ReportData[]> {
    return this.http.get<ReportData[]>('https://creativepeak-api.onrender.com/monthly-summary');
  }
}
