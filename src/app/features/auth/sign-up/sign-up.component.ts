import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpComponent {
  protected fullName = '';
  protected email = '';
  protected password = '';
  protected showPassword = signal(false);
  protected isLoading = signal(false);

  protected togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  protected onSubmit(): void {
    if (!this.fullName || !this.email || !this.password) return;
    this.isLoading.set(true);
    // Auth logic placeholder
  }
}
