import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { UsersComponent } from './components/users/users.component';
import { AddEditUserComponent } from './components/add-edit-user/add-edit-user.component';
import { ReportsComponent } from './components/reports/reports.component';

export const routes: Routes = [
    // { path: '', redirectTo: '/', pathMatch: 'full' },
    { path: '', component: HomeComponent },
    { path: 'welcome', component: WelcomeComponent },
    { path: 'logIn', component: LogInComponent },
    { path: 'users', component: UsersComponent },
    { path: 'addUser', component: AddEditUserComponent },
    { path: 'addUser/:id', component: AddEditUserComponent },
    { path: 'reports', component: ReportsComponent },
    // { path: '**', redirectTo: '/welcome' }
];
