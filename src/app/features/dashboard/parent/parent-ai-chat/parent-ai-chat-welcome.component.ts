import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AiChatService } from '../../../ai-chat/ai-chat.service';

interface Prompt {
  icon: string;
  label: string;
  message: string;
}

const PROMPTS: Prompt[] = [
  { icon: 'insights',      label: 'How is Alex doing?',         message: 'Give me a full summary of how Alex is doing this term' },
  { icon: 'flag',          label: 'What needs attention?',      message: 'What does Alex need to work on most right now?' },
  { icon: 'people',        label: 'Find tutors near me',        message: 'Find me tutors near me for Alex' },
  { icon: 'collections_bookmark', label: 'Suggest materials',  message: 'Suggest learning materials and resources for Alex' },
];

const CHILD_STATS = [
  { label: 'GPA',        value: '3.7' },
  { label: 'Attendance', value: '94%' },
  { label: 'Class Rank', value: '#36' },
  { label: 'Missing',    value: '0'   },
];

@Component({
  selector: 'app-parent-ai-chat-welcome',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './parent-ai-chat-welcome.component.html',
  styleUrl: './parent-ai-chat-welcome.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParentAiChatWelcomeComponent {
  protected readonly prompts = PROMPTS;
  protected readonly stats = CHILD_STATS;

  private readonly service = inject(AiChatService);

  protected send(message: string): void {
    this.service.sendMessage(message);
  }
}
