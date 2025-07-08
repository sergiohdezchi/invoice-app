import { Routes } from '@angular/router';
import { InvoicePageComponent } from './pages/invoice-page/invoice-page.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { authGuard } from './guards/auth.guard';
import { publicGuard } from './guards/public.guard';

export const routes: Routes = [
  { 
    path: '', 
    component: InvoicePageComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'login', 
    component: LoginComponent,
    canActivate: [publicGuard]
  },
  { 
    path: 'register', 
    component: RegisterComponent,
    canActivate: [publicGuard]
  },
  { path: '**', redirectTo: '' }
];
