import {
  Component,
  ChangeDetectionStrategy,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AiChatService } from './ai-chat.service';

type SR = any;

@Component({
  selector: 'app-ai-chat-input',
  standalone: true,
  imports: [MatTooltipModule],
  templateUrl: './ai-chat-input.component.html',
  styleUrl: './ai-chat-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiChatInputComponent {
  protected service = inject(AiChatService);
  protected message = signal('');
  protected isListening = signal(false);

  protected readonly voiceSupported =
    typeof window !== 'undefined' &&
    !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

  private textareaRef = viewChild<ElementRef<HTMLTextAreaElement>>('textarea');
  private recognition: any = null;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.recognition?.abort());
  }

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

    const ta = this.textareaRef()?.nativeElement;
    if (ta) { ta.value = ''; ta.style.height = 'auto'; }
  }

  protected toggleVoice(): void {
    this.isListening() ? this.stopListening() : this.startListening();
  }

  private startListening(): void {
    const SR: SR = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
    if (!SR) return;

    this.recognition = new SR();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    let committed = this.message();

    this.recognition.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const r = event.results[i];
        if (r.isFinal) committed += r[0].transcript;
        else interim += r[0].transcript;
      }
      const full = committed + interim;
      this.message.set(full);
      const ta = this.textareaRef()?.nativeElement;
      if (ta) { ta.value = full; this.autoResize(ta); }
    };

    this.recognition.onend = () => this.isListening.set(false);
    this.recognition.onerror = () => this.isListening.set(false);
    this.recognition.start();
    this.isListening.set(true);
  }

  private stopListening(): void {
    this.recognition?.stop();
    this.isListening.set(false);
  }

  private autoResize(ta: HTMLTextAreaElement): void {
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 200) + 'px';
  }
}
