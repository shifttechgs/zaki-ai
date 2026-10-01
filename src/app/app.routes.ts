import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'ai-chat', pathMatch: 'full' },
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
        path: 'parent',
        loadComponent: () =>
          import('./features/dashboard/parent/parent-dashboard.component').then(
            m => m.ParentDashboardComponent,
          ),
      },
    ],
  },
  { path: '**', redirectTo: 'ai-chat' },
];
