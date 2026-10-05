import { Injectable, signal, computed } from '@angular/core';
import { Conversation, ConversationGroup } from '../../../ai-chat/models/conversation';
import { Message } from '../../../ai-chat/models/message';

const STUDENT = {
  name: 'Alex Johnson',
  grade: 10,
  school: "St. Mary's High School",
  gpa: 3.7,
  attendance: 94,
  credits: { earned: 45, total: 120 },
  subjects: [
    { name: 'Mathematics', grade: 'A', score: 88, teacher: 'Mr. Thompson', time: '08:00', room: 'Room 201' },
    { name: 'English Literature', grade: 'B+', score: 76, teacher: 'Mrs. Davis', time: '10:00', room: 'Room 105' },
    { name: 'Physics', grade: 'A', score: 92, teacher: 'Dr. Patel', time: '13:00', room: 'Lab 3' },
    { name: 'History', grade: 'A+', score: 95, teacher: 'Ms. Garcia', time: '15:00', room: 'Room 302' },
  ],
  assignments: [
    { name: 'Algebra Homework #7', subject: 'Mathematics', due: 'Tomorrow', urgent: true },
    { name: 'Essay Final Draft', subject: 'English Literature', due: 'In 3 days', urgent: false },
    { name: 'Physics Lab Write-up', subject: 'Physics', due: 'In 5 days', urgent: false },
  ],
};

function startOfDayMs(date: Date): number {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

@Injectable()
export class StudentAiChatService {
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

    if (q.match(/assign|due|homework|submit|deadline|pending/)) {
      const urgent = STUDENT.assignments.filter(a => a.urgent);
      const rest = STUDENT.assignments.filter(a => !a.urgent);
      return (
        `**Your Upcoming Assignments**\n\n` +
        (urgent.length ? `🔴 **Urgent**\n` + urgent.map(a => `• **${a.name}** · ${a.subject} — due ${a.due}`).join('\n') + '\n\n' : '') +
        `📋 **Coming up**\n` +
        rest.map(a => `• **${a.name}** · ${a.subject} — due ${a.due}`).join('\n') +
        `\n\nI'd tackle the Algebra Homework first since it's due tomorrow. The Essay Final Draft in 3 days gives you time to do a second pass — aim to finish a rough version today.`
      );
    }

    if (q.match(/grade|gpa|score|result|mark|perform/)) {
      return (
        `**Your Grades — Term 3**\n\n` +
        `Current GPA: **${STUDENT.gpa}** · Top 20% of your year group\n\n` +
        STUDENT.subjects.map(s => `• **${s.name}** — ${s.grade} (${s.score}/100)`).join('\n') +
        `\n\n**Where to focus:** English Literature is your lowest score at 76/100 (B+). The essay structure is likely where marks are being lost — try outlining your argument before writing and make sure each paragraph has a clear topic sentence. Everything else is tracking A or above.`
      );
    }

    if (q.match(/english|essay|writing|literature|davis/)) {
      return (
        `**Improving Your English Grade**\n\n` +
        `Your current score is **76/100 (B+)** with Mrs. Davis. Here's how to push it to an A:\n\n` +
        `1. **Essay structure** — Use the PEEL method: Point, Evidence, Explanation, Link back to the question.\n` +
        `2. **Vocabulary** — Avoid repeating the same words. Before you write, jot down 5 alternative ways to express your main idea.\n` +
        `3. **Your Essay Final Draft is due in 3 days** — This is a real opportunity. Spend 20 minutes re-reading the marking criteria before your final edit.\n\n` +
        `Even a 7-8 point improvement would bring you to an A. It's very achievable with one focused revision session.`
      );
    }

    if (q.match(/physics|math|history|algebra|lab|thompson|patel|garcia/)) {
      const subject = STUDENT.subjects.find(s =>
        q.includes(s.name.toLowerCase()) ||
        q.includes(s.teacher.split(' ')[1].toLowerCase())
      ) ?? STUDENT.subjects[2];
      return (
        `**${subject.name} — Study Tips**\n\n` +
        `You're currently at **${subject.score}/100 (${subject.grade})** with ${subject.teacher}.\n\n` +
        (subject.score >= 90
          ? `You're already performing really well here. To maintain it:\n• Keep reviewing past papers under timed conditions\n• Help a classmate — teaching is the fastest way to solidify knowledge\n• Focus revision on any topics where you lost marks last time`
          : `To push your score higher:\n• Past papers are your best tool — do one per week\n• Note every mistake and revisit that concept the same day\n• Ask ${subject.teacher} for the marking scheme so you know exactly what earns full marks`) +
        `\n\nYour next ${subject.name} class is at ${subject.time} in ${subject.room}.`
      );
    }

    if (q.match(/schedule|today|class|timetable|next|when|room/)) {
      return (
        `**Today's Schedule**\n\n` +
        STUDENT.subjects.map(s => `• **${s.time}** — ${s.name} · ${s.teacher} · ${s.room}`).join('\n') +
        `\n\nYou have **English Literature** right now (10:00, Room 105). Physics and History are this afternoon — both strong subjects for you so a good day ahead.`
      );
    }

    if (q.match(/credit|progress|graduation|degree|year/)) {
      return (
        `**Credit Progress**\n\n` +
        `You've earned **${STUDENT.credits.earned} of ${STUDENT.credits.total} credits** required to graduate.\n\n` +
        `That's ${Math.round((STUDENT.credits.earned / STUDENT.credits.total) * 100)}% of the way there. At your current pace you're on track to complete your credits by the end of Year 12.\n\n` +
        `Your GPA of **${STUDENT.gpa}** keeps your options open for most university programmes. If you have specific courses or universities in mind, let me know and I can help you figure out what you still need.`
      );
    }

    return (
      `Hi ${STUDENT.name}! I'm your AI study assistant. Here's where you stand:\n\n` +
      `• **GPA:** ${STUDENT.gpa} · Top 20% of your year\n` +
      `• **Attendance:** ${STUDENT.attendance}%\n` +
      `• **Credits:** ${STUDENT.credits.earned}/${STUDENT.credits.total} earned\n` +
      `• **Due soon:** ${STUDENT.assignments.length} assignments\n\n` +
      `You can ask me things like "What's due this week?", "How can I improve my English grade?", or "Help me prepare for Physics".`
    );
  }
}
