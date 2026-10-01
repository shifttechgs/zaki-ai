import {
  Component,
  ChangeDetectionStrategy,
  inject,
  viewChild,
  ElementRef,
  effect,
  afterEveryRender,
} from '@angular/core';
import { AiChatService } from './ai-chat.service';
import { ChatMessageComponent } from './chat-message.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-ai-chat-messages',
  standalone: true,
  imports: [ChatMessageComponent, MatIconModule],
  templateUrl: './ai-chat-messages.component.html',
  styleUrl: './ai-chat-messages.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiChatMessagesComponent {
  protected service = inject(AiChatService);
  private bottomAnchor = viewChild<ElementRef<HTMLElement>>('bottom');
  private pendingScroll = false;

  constructor() {
    effect(() => {
      // Track changes that require scrolling to bottom
      this.service.activeConversation()?.messages.length;
      this.service.isResponding();
      this.pendingScroll = true;
    });

    afterEveryRender(() => {
      if (this.pendingScroll) {
        this.pendingScroll = false;
        this.bottomAnchor()?.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}
