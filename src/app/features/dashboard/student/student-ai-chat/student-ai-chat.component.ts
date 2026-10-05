import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { AiChatService } from '../../../ai-chat/ai-chat.service';
import { AiChatMessagesComponent } from '../../../ai-chat/ai-chat-messages.component';
import { AiChatInputComponent } from '../../../ai-chat/ai-chat-input.component';
import { StudentAiChatWelcomeComponent } from './student-ai-chat-welcome.component';
import { StudentAiChatService } from './student-ai-chat.service';

@Component({
  selector: 'app-student-ai-chat',
  standalone: true,
  imports: [AiChatMessagesComponent, AiChatInputComponent, StudentAiChatWelcomeComponent],
  providers: [{ provide: AiChatService, useClass: StudentAiChatService }],
  templateUrl: './student-ai-chat.component.html',
  styleUrl: './student-ai-chat.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentAiChatComponent {
  protected readonly service = inject(AiChatService);

  protected readonly showWelcome = computed(() => {
    const conv = this.service.activeConversation();
    return !conv || conv.messages.length === 0;
  });
}
