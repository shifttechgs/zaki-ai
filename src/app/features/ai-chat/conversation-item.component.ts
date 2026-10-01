import { Component, ChangeDetectionStrategy, inject, input, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { Conversation } from './models/conversation';
import { AiChatService } from './ai-chat.service';

@Component({
  selector: 'app-conversation-item',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatMenuModule],
  templateUrl: './conversation-item.component.html',
  styleUrl: './conversation-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationItemComponent {
  conversation = input.required<Conversation>();
  isActive = input.required<boolean>();

  protected hovered = signal(false);
  private service = inject(AiChatService);

  protected select(): void {
    this.service.selectConversation(this.conversation().id);
  }

  protected delete(): void {
    this.service.deleteConversation(this.conversation().id);
  }
}
