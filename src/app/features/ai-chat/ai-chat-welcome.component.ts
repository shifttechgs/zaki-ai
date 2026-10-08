import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SuggestionCardComponent } from './suggestion-card.component';
import { AiChatService } from './ai-chat.service';

interface Suggestion {
  icon: string;
  title: string;
  description: string;
  gradient: string;
}

const SUGGESTIONS: Suggestion[] = [
  {
    icon: 'devices',
    gradient: 'linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)',
    title: 'How does the Zaki device work?',
    description: 'Learn how Zaki helps kids study, quiz and grow at home',
  },
  {
    icon: 'supervisor_account',
    gradient: 'linear-gradient(135deg, #0EA5E9 0%, #6366F1 100%)',
    title: 'What can parents track?',
    description: 'See grades, activity, AI insights and progress reports',
  },
  {
    icon: 'school',
    gradient: 'linear-gradient(135deg, #059669 0%, #0EA5E9 100%)',
    title: 'What subjects does Zaki cover?',
    description: 'Explore the curriculum — maths, science, history and more',
  },
  {
    icon: 'auto_awesome',
    gradient: 'linear-gradient(135deg, #D97706 0%, #EF4444 100%)',
    title: 'How does Zaki AI personalise learning?',
    description: 'Understand how the AI adapts to each child\'s pace and needs',
  },
];

@Component({
  selector: 'app-ai-chat-welcome',
  standalone: true,
  imports: [MatIconModule, SuggestionCardComponent],
  templateUrl: './ai-chat-welcome.component.html',
  styleUrl: './ai-chat-welcome.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiChatWelcomeComponent {
  protected suggestions = SUGGESTIONS;
  private service = inject(AiChatService);

  protected useSuggestion(title: string): void {
    this.service.sendMessage(title);
  }
}
