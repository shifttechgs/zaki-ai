import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AiChatService } from './ai-chat.service';

interface Prompt { icon: string; label: string; message: string; }

const PROMPTS: Prompt[] = [
  { icon: 'devices',            label: 'How does the Zaki device work?',       message: 'How does the Zaki device work?' },
  { icon: 'supervisor_account', label: 'What can parents see and track?',       message: 'What can parents see and track in the Zaki portal?' },
  { icon: 'school',             label: 'What subjects does Zaki cover?',        message: 'What subjects does Zaki cover?' },
  { icon: 'auto_awesome',       label: 'How does Zaki AI personalise learning?', message: 'How does Zaki AI personalise learning for each child?' },
];

@Component({
  selector: 'app-ai-chat-welcome',
  standalone: true,
  imports: [MatIconModule, RouterLink],
  templateUrl: './ai-chat-welcome.component.html',
  styleUrl: './ai-chat-welcome.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiChatWelcomeComponent {
  protected readonly prompts = PROMPTS;
  private readonly service = inject(AiChatService);

  protected send(message: string): void {
    this.service.sendMessage(message);
  }
}
