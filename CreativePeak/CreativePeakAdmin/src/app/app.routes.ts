import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { LogInComponent } from './components/log-in/log-in.component';

export const routes: Routes = [
    // { path: '', redirectTo: '/', pathMatch: 'full' },
    { path: '', component: HomeComponent },
    { path: 'welcome', component: WelcomeComponent },
    { path: 'logIn', component: LogInComponent },
    // { path: '**', redirectTo: '/welcome' }
];
