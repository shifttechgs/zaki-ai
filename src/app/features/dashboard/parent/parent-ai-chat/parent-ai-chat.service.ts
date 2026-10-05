import { Injectable, signal, computed } from '@angular/core';
import { Conversation, ConversationGroup } from '../../../ai-chat/models/conversation';
import { Message } from '../../../ai-chat/models/message';

const CHILD = {
  name: 'Alex Johnson',
  grade: 10,
  school: "St. Mary's High School",
  gpa: 3.7,
  attendance: 94,
  absences: 2,
  rank: 'Top 20%',
  rankOf: 180,
  missingWork: 0,
  subjects: [
    { name: 'Mathematics', grade: 'A', score: 88, teacher: 'Mr. Thompson' },
    { name: 'English', grade: 'B+', score: 76, teacher: 'Mrs. Davis' },
    { name: 'Physics', grade: 'A', score: 92, teacher: 'Dr. Patel' },
    { name: 'History', grade: 'A+', score: 95, teacher: 'Ms. Garcia' },
  ],
  upcomingEvents: [
    { title: 'Parent-Teacher Conference', date: '15 Nov 2026' },
    { title: 'Science Fair', date: '20 Nov 2026' },
    { title: 'End of Term', date: '20 Dec 2026' },
  ],
};

function startOfDayMs(date: Date): number {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

@Injectable()
export class ParentAiChatService {
  private readonly _conversations = signal<Conversation[]>([]);
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
      if (t >= todayMs) groups[0].conversations.push(conv);
      else if (t >= yesterdayMs) groups[1].conversations.push(conv);
      else if (t >= sevenDaysMs) groups[2].conversations.push(conv);
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
    if (this._activeId() === id) this._activeId.set(null);
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
        content: this.buildResponse(trimmed),
        timestamp: new Date(),
      };
      this._conversations.update(cs =>
        cs.map(c => c.id === capturedId ? { ...c, messages: [...c.messages, aiMsg] } : c)
      );
      this._isResponding.set(false);
    }, 1200);
  }

  private buildResponse(prompt: string): string {
    const q = prompt.toLowerCase();

    if (q.match(/perform|gpa|grade|subject|result|academ/)) {
      return (
        `**${CHILD.name}'s Academic Performance — Term 3**\n\n` +
        `Overall GPA is **${CHILD.gpa}**, placing ${CHILD.name} in the **${CHILD.rank}** of ${CHILD.rankOf} students at ${CHILD.school}.\n\n` +
        `**Subject breakdown:**\n` +
        CHILD.subjects.map(s => `• **${s.name}** — ${s.grade} (${s.score}/100) · ${s.teacher}`).join('\n') +
        `\n\nStrong performance in History and Physics. English is the area most worth watching — the B+ on the essay draft suggests there's room to improve written structure. I'd recommend asking Mrs. Davis for specific feedback if you haven't already.`
      );
    }

    if (q.match(/attend|absent|absence|miss.*school|school.*miss/)) {
      return (
        `**Attendance Summary — Term 3**\n\n` +
        `${CHILD.name}'s attendance rate is **${CHILD.attendance}%** this term, with **${CHILD.absences} absences** recorded.\n\n` +
        `Both absences were in the first half of term. Since then, ${CHILD.name} has had a perfect attendance streak. There is currently **no missing work** — all assignments are up to date.\n\n` +
        `This is within the school's acceptable range and well above the 85% minimum threshold. No action needed at this stage.`
      );
    }

    if (q.match(/upcom|event|next|schedule|week|soon|calendar/)) {
      return (
        `**Upcoming for ${CHILD.name}**\n\n` +
        CHILD.upcomingEvents.map(e => `• **${e.title}** — ${e.date}`).join('\n') +
        `\n\nThe Parent-Teacher Conference on 15 Nov is the most important near-term date — it's a good opportunity to discuss the English essay progress directly with Mrs. Davis. I'd suggest noting a few questions beforehand.`
      );
    }

    if (q.match(/summar|overview|how.*doing|overall|report|this term/)) {
      return (
        `**Term 3 Summary — ${CHILD.name}**\n\n` +
        `**GPA:** ${CHILD.gpa} · **Rank:** ${CHILD.rank} of ${CHILD.rankOf} students\n` +
        `**Attendance:** ${CHILD.attendance}% · ${CHILD.absences} absences · 0 missing assignments\n\n` +
        `${CHILD.name} is performing well across the board. History (A+) and Physics (A) are stand-out subjects. English (B+) is the one area to monitor — still a solid grade but below the standard set in other subjects.\n\n` +
        `There are no attendance or behavioural concerns. The next key milestone is the Parent-Teacher Conference on 15 Nov 2026.`
      );
    }

    if (q.match(/concern|worry|problem|issue|trouble|struggle/)) {
      return (
        `**Areas to Watch for ${CHILD.name}**\n\n` +
        `Overall, there's nothing urgent to flag. A few things worth keeping an eye on:\n\n` +
        `• **English (B+)** — slightly below ${CHILD.name}'s performance in other subjects. The essay draft scored 76/100. Following up with Mrs. Davis at the upcoming conference would be worthwhile.\n` +
        `• **Attendance** — two absences this term, both early on. The streak since has been perfect, so this is minor.\n\n` +
        `No missing work, no disciplinary notes, and the GPA is strong at ${CHILD.gpa}. These are areas to monitor, not causes for concern right now.`
      );
    }

    return (
      `I'm your AI assistant for tracking ${CHILD.name}'s school progress at ${CHILD.school}.\n\n` +
      `Here's a quick snapshot:\n` +
      `• **GPA:** ${CHILD.gpa} (${CHILD.rank} of ${CHILD.rankOf} students)\n` +
      `• **Attendance:** ${CHILD.attendance}% · ${CHILD.absences} absences\n` +
      `• **Missing work:** ${CHILD.missingWork}\n\n` +
      `You can ask me things like "How is Alex performing this term?", "Any concerns I should know about?", or "What's coming up this week?"`
    );
  }
}
