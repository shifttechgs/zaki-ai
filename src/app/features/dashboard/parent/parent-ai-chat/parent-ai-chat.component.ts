import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { AiChatService } from '../../../ai-chat/ai-chat.service';
import { AiChatMessagesComponent } from '../../../ai-chat/ai-chat-messages.component';
import { AiChatInputComponent } from '../../../ai-chat/ai-chat-input.component';
import { ParentAiChatWelcomeComponent } from './parent-ai-chat-welcome.component';
import { ParentAiChatService } from './parent-ai-chat.service';

@Component({
  selector: 'app-parent-ai-chat',
  standalone: true,
  imports: [AiChatMessagesComponent, AiChatInputComponent, ParentAiChatWelcomeComponent],
  providers: [{ provide: AiChatService, useClass: ParentAiChatService }],
  templateUrl: './parent-ai-chat.component.html',
  styleUrl: './parent-ai-chat.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParentAiChatComponent {
  protected readonly service = inject(AiChatService);

  protected readonly showWelcome = computed(() => {
    const conv = this.service.activeConversation();
    return !conv || conv.messages.length === 0;
  });
}
