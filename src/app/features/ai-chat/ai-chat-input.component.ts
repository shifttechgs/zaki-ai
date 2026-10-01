import {
  Component,
  ChangeDetectionStrategy,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AiChatService } from './ai-chat.service';

// SpeechRecognition is not in the default TypeScript lib — cast via window
type SR = typeof SpeechRecognition;

@Component({
  selector: 'app-ai-chat-input',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './ai-chat-input.component.html',
  styleUrl: './ai-chat-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiChatInputComponent {
  protected service = inject(AiChatService);
  protected message = signal('');
  protected isListening = signal(false);
  protected interimTranscript = signal('');

  protected readonly voiceSupported =
    typeof window !== 'undefined' &&
    !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

  private textareaRef = viewChild<ElementRef<HTMLTextAreaElement>>('textarea');
  private recognition: InstanceType<SR> | null = null;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.recognition?.abort());
  }

  // ── Input ──────────────────────────────────────────────────────────────────
  protected onInput(event: Event): void {
    const ta = event.target as HTMLTextAreaElement;
    this.message.set(ta.value);
    this.autoResize(ta);
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

    if (this.isListening()) this.stopListening();

    this.service.sendMessage(content);
    this.message.set('');
    this.interimTranscript.set('');

    const ta = this.textareaRef()?.nativeElement;
    if (ta) { ta.value = ''; ta.style.height = 'auto'; }
  }

  // ── Voice ──────────────────────────────────────────────────────────────────
  protected toggleVoice(): void {
    this.isListening() ? this.stopListening() : this.startListening();
  }

  private startListening(): void {
    const SpeechRecognition: SR =
      (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    // Track the committed (final) text separately so interim doesn't overwrite it
    let committed = this.message();

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      let newCommitted = committed;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          newCommitted += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      committed = newCommitted;
      const full = committed + interim;
      this.message.set(full);
      this.interimTranscript.set(interim);

      const ta = this.textareaRef()?.nativeElement;
      if (ta) { ta.value = full; this.autoResize(ta); }
    };

    this.recognition.onend = () => this.isListening.set(false);
    this.recognition.onerror = () => { this.isListening.set(false); };

    this.recognition.start();
    this.isListening.set(true);
  }

  private stopListening(): void {
    this.recognition?.stop();
    this.isListening.set(false);
    this.interimTranscript.set('');
  }

  private autoResize(ta: HTMLTextAreaElement): void {
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 140) + 'px';
  }
}
