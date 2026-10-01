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
    icon: 'schema',
    gradient: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
    title: 'Review a migration plan',
    description: 'Analyze your database or codebase migration strategy',
  },
  {
    icon: 'summarize',
    gradient: 'linear-gradient(135deg, #0EA5E9 0%, #6366F1 100%)',
    title: 'Summarize a long document',
    description: 'Distill key points from lengthy reports or articles',
  },
  {
    icon: 'rocket_launch',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
    title: 'Brainstorm launch angles',
    description: 'Generate creative ideas for your product or campaign',
  },
  {
    icon: 'bug_report',
    gradient: 'linear-gradient(135deg, #10B981 0%, #0EA5E9 100%)',
    title: 'Debug a failing query',
    description: 'Diagnose and fix SQL or API query issues',
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
