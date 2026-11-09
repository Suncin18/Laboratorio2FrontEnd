import { Routes } from '@angular/router';
import { Products } from './products/products';
import { categories } from './categories/categories';
import { Login } from './login/login';
import { authGuard } from './guard/auth-guard';
import { NotFound } from './not-found/not-found';
import { adminGuard } from './guard/admin-guard';
import { Users } from './components/users/users';

export const routes: Routes = [
    { path: 'login', component: Login },
    { path: 'products', component: Products, canActivate: [authGuard] },
    { path: 'categories', component: categories, canActivate: [authGuard] },
    { path: 'users', component: Users, canActivate: [adminGuard]},
    { path: '**', component: NotFound, canActivate: [authGuard]},
    { path: '', redirectTo: 'login', pathMatch: 'full' }
];