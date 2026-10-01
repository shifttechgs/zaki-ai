import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { AiChatSidebarComponent } from './ai-chat-sidebar.component';
import { AiChatMainComponent } from './ai-chat-main.component';

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [AiChatSidebarComponent, AiChatMainComponent],
  templateUrl: './ai-chat.component.html',
  styleUrl: './ai-chat.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiChatComponent {
  protected sidebarOpen = signal(true);

  protected toggleSidebar(): void {
    this.sidebarOpen.update(open => !open);
  }
}
