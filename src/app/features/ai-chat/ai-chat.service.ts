import { Injectable, signal, computed } from '@angular/core';
import { Conversation, ConversationGroup } from './models/conversation';
import { Message } from './models/message';

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(10, 30, 0, 0);
  return d;
}

function startOfDayMs(date: Date): number {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    title: 'Zoneless change detection migration',
    createdAt: daysAgo(0),
    messages: [
      {
        id: '1a',
        role: 'user',
        content: 'How do I migrate to zoneless change detection in Angular 22?',
        timestamp: daysAgo(0),
      },
      {
        id: '1b',
        role: 'assistant',
        content:
          'Migrating to zoneless change detection in Angular 22 is straightforward.\n\n' +
          '1. Remove zone.js from your polyfills in angular.json\n' +
          '2. Add provideExperimentalZonelessChangeDetection() to your app.config.ts\n' +
          '3. Ensure all components use signals or markForCheck() to trigger updates\n\n' +
          'The key benefit is improved performance since Angular no longer patches async operations.',
        timestamp: daysAgo(0),
      },
    ],
  },
  {
    id: '2',
    title: 'Pricing page copy for SaaS',
    createdAt: daysAgo(0),
    messages: [
      {
        id: '2a',
        role: 'user',
        content: 'Write compelling copy for a SaaS pricing page',
        timestamp: daysAgo(0),
      },
      {
        id: '2b',
        role: 'assistant',
        content:
          'Here\'s compelling pricing page copy:\n\n' +
          '**Simple pricing, powerful results**\n' +
          'Choose the plan that grows with your business. No hidden fees, cancel anytime.\n\n' +
          '• Starter — Perfect for individuals\n' +
          '• Pro — Best for growing teams\n' +
          '• Enterprise — For large organisations',
        timestamp: daysAgo(0),
      },
    ],
  },
  {
    id: '3',
    title: 'RxJS vs Signals comparison',
    createdAt: daysAgo(1),
    messages: [],
  },
  {
    id: '4',
    title: 'Docker Compose setup for Node',
    createdAt: daysAgo(1),
    messages: [],
  },
  {
    id: '5',
    title: 'Angular Material theming guide',
    createdAt: daysAgo(3),
    messages: [],
  },
  {
    id: '6',
    title: 'Implementing JWT refresh tokens',
    createdAt: daysAgo(5),
    messages: [],
  },
];

@Injectable({ providedIn: 'root' })
export class AiChatService {
  private readonly _conversations = signal<Conversation[]>(MOCK_CONVERSATIONS);
  private readonly _activeId = signal<string | null>(null);
  private readonly _isResponding = signal(false);

  readonly conversations = this._conversations.asReadonly();
  readonly activeId = this._activeId.asReadonly();
  readonly isResponding = this._isResponding.asReadonly();

  readonly activeConversation = computed(() =>
    this._conversations().find(c => c.id === this._activeId()) ?? null
  );

  readonly groupedConversations = computed((): ConversationGroup[] => {
    const now = new Date();
    const todayMs = startOfDayMs(now);
    const yesterdayMs = todayMs - 86_400_000;
    const sevenDaysMs = todayMs - 7 * 86_400_000;

    const groups: ConversationGroup[] = [
      { label: 'Today', conversations: [] },
      { label: 'Yesterday', conversations: [] },
      { label: 'Previous 7 days', conversations: [] },
    ];

    for (const conv of this._conversations()) {
      const t = conv.createdAt.getTime();
      if (t >= todayMs) {
        groups[0].conversations.push(conv);
      } else if (t >= yesterdayMs) {
        groups[1].conversations.push(conv);
      } else if (t >= sevenDaysMs) {
        groups[2].conversations.push(conv);
      }
    }

    return groups;
  });

  selectConversation(id: string): void {
    this._activeId.set(id);
  }

  startNewConversation(): void {
    this._activeId.set(null);
  }

  deleteConversation(id: string): void {
    this._conversations.update(cs => cs.filter(c => c.id !== id));
    if (this._activeId() === id) {
      this._activeId.set(null);
    }
  }

  sendMessage(content: string): void {
    const trimmed = content.trim();
    if (!trimmed || this._isResponding()) return;

    let convId = this._activeId();

    if (!convId) {
      const newConv: Conversation = {
        id: crypto.randomUUID(),
        title: trimmed.slice(0, 60),
        messages: [],
        createdAt: new Date(),
      };
      this._conversations.update(cs => [newConv, ...cs]);
      this._activeId.set(newConv.id);
      convId = newConv.id;
    }

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    };

    this._conversations.update(cs =>
      cs.map(c => c.id === convId ? { ...c, messages: [...c.messages, userMsg] } : c)
    );

    this._isResponding.set(true);

    const capturedId = convId;
    setTimeout(() => {
      const aiMsg: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: this.buildMockResponse(trimmed),
        timestamp: new Date(),
      };
      this._conversations.update(cs =>
        cs.map(c => c.id === capturedId ? { ...c, messages: [...c.messages, aiMsg] } : c)
      );
      this._isResponding.set(false);
    }, 1200);
  }

  private buildMockResponse(prompt: string): string {
    const preview = prompt.length > 60 ? prompt.slice(0, 60) + '…' : prompt;
    return (
      `I understand you're asking about "${preview}".\n\n` +
      `This is a demo response — in production this would connect to an AI backend service. ` +
      `You can type any message or click a suggestion card to start a conversation.`
    );
  }
}
