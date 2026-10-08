import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ai-chat-welcome',
  standalone: true,
  imports: [MatIconModule, RouterLink],
  templateUrl: './ai-chat-welcome.component.html',
  styleUrl: './ai-chat-welcome.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiChatWelcomeComponent {}
