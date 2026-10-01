import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected email = '';
  protected password = '';
  protected showPassword = signal(false);
  protected isLoading = signal(false);
  protected error = signal('');

  protected togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  protected onSubmit(): void {
    if (!this.email || !this.password) return;
    this.error.set('');
    this.isLoading.set(true);

    const result = this.auth.login(this.email, this.password);

    this.isLoading.set(false);

    if (result.ok) {
      this.auth.redirectToDashboard();
    } else {
      this.error.set(result.error ?? 'An unexpected error occurred.');
    }
  }
}
