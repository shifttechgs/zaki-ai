import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SuggestionCardComponent } from '../../../ai-chat/suggestion-card.component';
import { AiChatService } from '../../../ai-chat/ai-chat.service';

interface Suggestion {
  icon: string;
  title: string;
  description: string;
  gradient: string;
}

const SUGGESTIONS: Suggestion[] = [
  {
    icon: 'assignment_late',
    gradient: 'linear-gradient(135deg, #EF4444 0%, #D97706 100%)',
    title: "What's due this week?",
    description: 'See all pending assignments ranked by urgency',
  },
  {
    icon: 'bar_chart',
    gradient: 'linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)',
    title: 'How are my grades looking?',
    description: 'Full breakdown of your scores and GPA this term',
  },
  {
    icon: 'edit_note',
    gradient: 'linear-gradient(135deg, #0EA5E9 0%, #6366F1 100%)',
    title: 'Help me improve my English grade',
    description: 'Targeted tips to push your B+ to an A',
  },
  {
    icon: 'science',
    gradient: 'linear-gradient(135deg, #059669 0%, #0EA5E9 100%)',
    title: 'Help me prepare for Physics',
    description: 'Study strategies for your upcoming lab write-up',
  },
];

@Component({
  selector: 'app-student-ai-chat-welcome',
  standalone: true,
  imports: [MatIconModule, SuggestionCardComponent],
  templateUrl: './student-ai-chat-welcome.component.html',
  styleUrl: './student-ai-chat-welcome.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentAiChatWelcomeComponent {
  protected readonly suggestions = SUGGESTIONS;
  private readonly service = inject(AiChatService);

  protected useSuggestion(title: string): void {
    this.service.sendMessage(title);
  }
}
