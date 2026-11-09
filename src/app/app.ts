import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { inject } from '@angular/core';
import { AuthService } from './services/auth';

@Component({
  imports: [RouterOutlet, Navbar],
  selector: 'app-root',
  standalone: true,
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('laboratorio2-frontend');
  
  private authService = inject(AuthService);

  isAuthenticated = () => this.authService.authenticated();
}