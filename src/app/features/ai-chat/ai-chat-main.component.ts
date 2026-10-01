import { Component, ChangeDetectionStrategy, inject, input, output } from '@angular/core';
import { AiChatService } from './ai-chat.service';
import { AiChatHeaderComponent } from './ai-chat-header.component';
import { AiChatWelcomeComponent } from './ai-chat-welcome.component';
import { AiChatMessagesComponent } from './ai-chat-messages.component';
import { AiChatInputComponent } from './ai-chat-input.component';

@Component({
  selector: 'app-ai-chat-main',
  standalone: true,
  imports: [
    AiChatHeaderComponent,
    AiChatWelcomeComponent,
    AiChatMessagesComponent,
    AiChatInputComponent,
  ],
  templateUrl: './ai-chat-main.component.html',
  styleUrl: './ai-chat-main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiChatMainComponent {
  sidebarOpen = input.required<boolean>();
  toggleSidebar = output<void>();

  protected service = inject(AiChatService);

  protected get showWelcome(): boolean {
    const conv = this.service.activeConversation();
    return !conv || conv.messages.length === 0;
  }
}
