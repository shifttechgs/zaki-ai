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
    icon: 'insights',
    gradient: 'linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)',
    title: 'How is Alex performing this term?',
    description: 'Get a full breakdown of grades, GPA and class ranking',
  },
  {
    icon: 'event_available',
    gradient: 'linear-gradient(135deg, #059669 0%, #0EA5E9 100%)',
    title: 'Summarise attendance this term',
    description: 'Review absences, patterns and any missing work',
  },
  {
    icon: 'warning_amber',
    gradient: 'linear-gradient(135deg, #D97706 0%, #EF4444 100%)',
    title: 'Any concerns I should know about?',
    description: 'Surface subjects or habits that may need attention',
  },
  {
    icon: 'calendar_today',
    gradient: 'linear-gradient(135deg, #0EA5E9 0%, #7C3AED 100%)',
    title: "What's coming up this week?",
    description: 'Upcoming events, tests and school calendar milestones',
  },
];

@Component({
  selector: 'app-parent-ai-chat-welcome',
  standalone: true,
  imports: [MatIconModule, SuggestionCardComponent],
  templateUrl: './parent-ai-chat-welcome.component.html',
  styleUrl: './parent-ai-chat-welcome.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParentAiChatWelcomeComponent {
  protected readonly suggestions = SUGGESTIONS;
  private readonly service = inject(AiChatService);

  protected useSuggestion(title: string): void {
    this.service.sendMessage(title);
  }
}
