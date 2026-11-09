import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth';
import { Router } from '@angular/router';

@Component({
  imports: [FormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  username: string = '';
  password: string = '';

  errorMessage = signal('');
  isLoading = signal(false);

  constructor(private authService: AuthService, private router: Router){}

  async login(): Promise<void> {
    this.errorMessage.set('');
    this.isLoading.set(true);

    try{
      await this.authService.login(this.username, this.password);
      await this.router.navigate(['/products']);
    } catch (error) {
      this.errorMessage.set(error instanceof Error ? error.message : 'No se pudo iniciar sesión.');
    } finally {
      this.isLoading.set(false);
    }
  }
}