import { Component, ChangeDetectionStrategy, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AiChatService } from './ai-chat.service';
import { ConversationItemComponent } from './conversation-item.component';

@Component({
  selector: 'app-ai-chat-sidebar',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, ConversationItemComponent],
  templateUrl: './ai-chat-sidebar.component.html',
  styleUrl: './ai-chat-sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.open]': 'open()' },
})
export class AiChatSidebarComponent {
  open = input.required<boolean>();

  protected service = inject(AiChatService);
}
