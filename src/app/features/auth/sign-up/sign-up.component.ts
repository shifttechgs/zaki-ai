import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected fullName = '';
  protected email = '';
  protected password = '';
  protected showPassword = signal(false);
  protected isLoading = signal(false);
  protected error = signal('');

  protected togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  protected onSubmit(): void {
    if (!this.fullName || !this.email || !this.password) return;
    if (this.password.length < 8) {
      this.error.set('Password must be at least 8 characters.');
      return;
    }
    this.error.set('');
    this.isLoading.set(true);

    const result = this.auth.register(this.fullName, this.email, this.password);

    this.isLoading.set(false);

    if (result.ok) {
      this.auth.redirectToDashboard();
    } else {
      this.error.set(result.error ?? 'An unexpected error occurred.');
    }
  }
}
