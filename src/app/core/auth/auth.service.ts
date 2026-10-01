import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';

export type UserRole = 'student' | 'parent';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  initials: string;
  role: UserRole;
}

interface DemoUser extends AuthUser {
  password: string;
}

const STORAGE_KEY = 'zaki_user';

const DEMO_USERS: DemoUser[] = [
  {
    id: 'u1',
    email: 'student@demo.com',
    password: 'demo123',
    role: 'student',
    name: 'Alex Johnson',
    initials: 'AJ',
  },
  {
    id: 'u2',
    email: 'parent@demo.com',
    password: 'demo123',
    role: 'parent',
    name: 'Sarah Johnson',
    initials: 'SJ',
  },
];

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly router = inject(Router);

  private readonly _user = signal<AuthUser | null>(this.restoreFromStorage());
  readonly user = this._user.asReadonly();
  readonly isAuthed = computed(() => this._user() !== null);

  private restoreFromStorage(): AuthUser | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }

  login(email: string, password: string): { ok: boolean; error?: string } {
    const match = DEMO_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
    );

    if (!match) {
      return { ok: false, error: 'Invalid email or password.' };
    }

    const authUser: AuthUser = {
      id: match.id,
      email: match.email,
      name: match.name,
      initials: match.initials,
      role: match.role,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
    this._user.set(authUser);
    return { ok: true };
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    this._user.set(null);
    this.router.navigate(['/ai-chat']);
  }

  redirectToDashboard(): void {
    const u = this._user();
    if (!u) {
      this.router.navigate(['/auth/sign-in']);
      return;
    }
    this.router.navigate([`/dashboard/${u.role}`]);
  }
}
