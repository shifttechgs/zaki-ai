import { Component, ChangeDetectionStrategy, inject, signal, viewChild, ElementRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AiChatService } from './ai-chat.service';

@Component({
  selector: 'app-ai-chat-input',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './ai-chat-input.component.html',
  styleUrl: './ai-chat-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiChatInputComponent {
  protected service = inject(AiChatService);
  protected message = signal('');
  private textareaRef = viewChild<ElementRef<HTMLTextAreaElement>>('textarea');

  protected onInput(event: Event): void {
    const ta = event.target as HTMLTextAreaElement;
    this.message.set(ta.value);
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  protected send(): void {
    const content = this.message().trim();
    if (!content || this.service.isResponding()) return;

    this.service.sendMessage(content);
    this.message.set('');

    // Directly clear DOM value — [value] binding updates asynchronously with OnPush
    const ta = this.textareaRef()?.nativeElement;
    if (ta) {
      ta.value = '';
      ta.style.height = 'auto';
    }
  }
}
