import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { WelcomeComponent } from './components/welcome/welcome.component';

export const routes: Routes = [
    // { path: '', redirectTo: '/', pathMatch: 'full' },
    // { path: '/', component: HomeComponent },
    { path: 'welcome', component: WelcomeComponent },
    // { path: 'projects', component: AppComponent }, // Replace with actual components
    // { path: 'categories', component: AppComponent }, // Replace with actual components
    // { path: 'login', component: AppComponent }, // Replace with actual components
    // { path: 'register', component: AppComponent }, // Replace with actual components
    // { path: 'profile', component: AppComponent }, // Replace with actual components
    // { path: '**', redirectTo: '/welcome' }
];
