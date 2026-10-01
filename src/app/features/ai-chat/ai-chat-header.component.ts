import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-ai-chat-header',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './ai-chat-header.component.html',
  styleUrl: './ai-chat-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiChatHeaderComponent {
  sidebarOpen = input.required<boolean>();
  toggleSidebar = output<void>();
}
