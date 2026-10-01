import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'ai-chat',
    loadComponent: () =>
      import('./features/ai-chat/ai-chat.component').then(m => m.AiChatComponent),
  },
  { path: '', redirectTo: 'ai-chat', pathMatch: 'full' },
];
