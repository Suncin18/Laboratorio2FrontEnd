import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  imports: [RouterLink],
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})
export class Navbar {
  authService = inject(AuthService);
  private router = inject(Router);

  logout(): void{
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}