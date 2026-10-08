import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/auth/auth.service';

interface NavItem {
  label: string;
  path: string;
  icon: string;
  ai?: boolean;
}

const STUDENT_NAV: NavItem[] = [
  { label: 'Dashboard',   path: '/dashboard/student',          icon: 'home' },
  { label: 'My Classes',  path: '/dashboard/student',          icon: 'menu_book' },
  { label: 'Assignments', path: '/dashboard/student',          icon: 'assignment' },
  { label: 'Grades',      path: '/dashboard/student',          icon: 'bar_chart' },
  { label: 'Schedule',    path: '/dashboard/student',          icon: 'calendar_today' },
  { label: 'Messages',    path: '/dashboard/student',          icon: 'chat' },
  { label: 'Ask AI',      path: '/dashboard/student/ai-chat',  icon: 'auto_awesome', ai: true },
];

const PARENT_NAV: NavItem[] = [
  { label: 'Overview',    path: '/dashboard/parent/ai-chat',   icon: 'home',           ai: true },
  { label: 'My Children', path: '/dashboard/parent',           icon: 'people' },
  { label: 'Grades',      path: '/dashboard/parent',           icon: 'bar_chart' },
  { label: 'Attendance',  path: '/dashboard/parent',           icon: 'event_available' },
  { label: 'Calendar',    path: '/dashboard/parent',           icon: 'event' },
  { label: 'Messages',    path: '/dashboard/parent',           icon: 'chat' },
];

@Component({
  selector: 'app-dashboard-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, MatIconModule],
  templateUrl: './dashboard-shell.component.html',
  styleUrl: './dashboard-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardShellComponent {
  protected readonly auth = inject(AuthService);

  protected readonly navItems = computed<NavItem[]>(() => {
    const role = this.auth.user()?.role;
    return role === 'parent' ? PARENT_NAV : STUDENT_NAV;
  });

  protected readonly userRoleLabel = computed(() => {
    const role = this.auth.user()?.role ?? '';
    return role.charAt(0).toUpperCase() + role.slice(1);
  });

  protected logout(): void {
    this.auth.logout();
  }
}
