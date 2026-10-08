import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, NavigationEnd } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs/operators';
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
  { label: 'Overview',    path: '/dashboard/parent',                icon: 'home' },
  { label: 'My Children', path: '/dashboard/parent/children',       icon: 'people' },
  { label: 'Grades',      path: '/dashboard/parent/grades',         icon: 'bar_chart' },
  { label: 'Attendance',  path: '/dashboard/parent/attendance',     icon: 'event_available' },
  { label: 'Reports',     path: '/dashboard/parent/reports',        icon: 'insert_chart' },
  { label: 'Messages',    path: '/dashboard/parent/messages',       icon: 'chat' },
  { label: 'Settings',    path: '/dashboard/parent/settings',       icon: 'settings' },
  { label: 'Ask AI',      path: '/dashboard/parent/ai-chat',        icon: 'auto_awesome', ai: true },
];

const ROUTE_TITLES: Record<string, string> = {
  parent:     'Overview',
  student:    'Dashboard',
  children:   'My Children',
  grades:     'Grades',
  attendance: 'Attendance',
  reports:    'Reports',
  messages:   'Messages',
  calendar:   'Calendar',
  'ai-chat':  'Ask AI',
};

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
  private readonly router = inject(Router);

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(e => e.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  protected readonly pageTitle = computed<string>(() => {
    const segment = (this.currentUrl() ?? '').split('/').pop() ?? '';
    return ROUTE_TITLES[segment] ?? 'Overview';
  });

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
