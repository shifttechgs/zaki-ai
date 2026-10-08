import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/sign-in', pathMatch: 'full' },
  {
    path: 'ai-chat',
    loadComponent: () =>
      import('./features/ai-chat/ai-chat.component').then(m => m.AiChatComponent),
  },
  {
    path: 'auth/sign-in',
    loadComponent: () =>
      import('./features/auth/sign-in/sign-in.component').then(m => m.SignInComponent),
  },
  {
    path: 'auth/sign-up',
    loadComponent: () =>
      import('./features/auth/sign-up/sign-up.component').then(m => m.SignUpComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard-shell.component').then(
        m => m.DashboardShellComponent,
      ),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'student', pathMatch: 'full' },
      {
        path: 'student',
        loadComponent: () =>
          import('./features/dashboard/student/student-dashboard.component').then(
            m => m.StudentDashboardComponent,
          ),
      },
      {
        path: 'student/ai-chat',
        loadComponent: () =>
          import('./features/dashboard/student/student-ai-chat/student-ai-chat.component').then(
            m => m.StudentAiChatComponent,
          ),
      },
      {
        path: 'parent',
        loadComponent: () =>
          import('./features/dashboard/parent/parent-dashboard.component').then(
            m => m.ParentDashboardComponent,
          ),
      },
      {
        path: 'parent/children',
        loadComponent: () =>
          import('./features/dashboard/parent/parent-placeholder.component').then(
            m => m.ParentPlaceholderComponent,
          ),
        data: { feature: 'My Children', icon: 'people', description: 'Manage all your children\'s Zaki profiles and switch between their dashboards in one place.' },
      },
      {
        path: 'parent/grades',
        loadComponent: () =>
          import('./features/dashboard/parent/parent-placeholder.component').then(
            m => m.ParentPlaceholderComponent,
          ),
        data: { feature: 'Grades', icon: 'bar_chart', description: 'Detailed grade breakdowns per subject, assignment and term — with trend analysis over time.' },
      },
      {
        path: 'parent/attendance',
        loadComponent: () =>
          import('./features/dashboard/parent/parent-placeholder.component').then(
            m => m.ParentPlaceholderComponent,
          ),
        data: { feature: 'Attendance', icon: 'event_available', description: 'Full attendance history, absence notes and punctuality records synced from school.' },
      },
      {
        path: 'parent/messages',
        loadComponent: () =>
          import('./features/dashboard/parent/parent-placeholder.component').then(
            m => m.ParentPlaceholderComponent,
          ),
        data: { feature: 'Messages', icon: 'chat', description: 'Direct messaging with teachers and school staff — all in one organised inbox.' },
      },
      {
        path: 'parent/reports',
        loadComponent: () =>
          import('./features/dashboard/parent/parent-report/parent-report.component').then(
            m => m.ParentReportComponent,
          ),
      },
      {
        path: 'parent/ai-chat',
        loadComponent: () =>
          import('./features/dashboard/parent/parent-ai-chat/parent-ai-chat.component').then(
            m => m.ParentAiChatComponent,
          ),
      },
    ],
  },
  { path: '**', redirectTo: 'ai-chat' },
];
