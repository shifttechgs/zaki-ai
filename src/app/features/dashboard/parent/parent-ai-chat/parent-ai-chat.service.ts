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
  classRank: 36,
  missingWork: 0,
  subjects: [
    { name: 'History',     grade: 'A+', score: 95, teacher: 'Ms. Garcia',   trend: 'up' },
    { name: 'Physics',     grade: 'A',  score: 92, teacher: 'Dr. Patel',    trend: 'up' },
    { name: 'Mathematics', grade: 'A',  score: 88, teacher: 'Mr. Thompson', trend: 'up' },
    { name: 'English',     grade: 'B+', score: 76, teacher: 'Mrs. Davis',   trend: 'stable' },
    { name: 'Biology',     grade: 'B',  score: 74, teacher: 'Mr. Chen',     trend: 'down' },
  ],
  strengths: ['Analytical Thinking', 'Historical Analysis', 'Lab Work & Science', 'Reliability'],
  weaknesses: ['Essay structure (English)', 'Biology — cellular concepts', 'Deadline management'],
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

  selectConversation(id: string): void { this._activeId.set(id); }
  startNewConversation(): void { this._activeId.set(null); }

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

    // Performance / grades / academic overview
    if (q.match(/perform|gpa|grade|subject|result|academ/)) {
      return (
        `**${CHILD.name}'s Academic Performance — Term 3**\n\n` +
        `Overall GPA is **${CHILD.gpa}**, ranking ${CHILD.name} **#${CHILD.classRank} out of ${CHILD.rankOf} students** at ${CHILD.school}.\n\n` +
        `**Subject breakdown:**\n` +
        CHILD.subjects.map(s => `• **${s.name}** — ${s.grade} (${s.score}/100) · ${s.teacher}`).join('\n') +
        `\n\nStrong performances in History (95) and Physics (92). English (76) and Biology (74) are the areas most worth watching this term.`
      );
    }

    // Attendance
    if (q.match(/attend|absent|absence|miss.*school|school.*miss/)) {
      return (
        `**Attendance Summary — Term 3**\n\n` +
        `${CHILD.name}'s attendance rate is **${CHILD.attendance}%** with **${CHILD.absences} absences** recorded.\n\n` +
        `Both absences occurred early in the term. Since then ${CHILD.name} has had a perfect streak. All assignments are up to date — **${CHILD.missingWork} missing work** items.\n\n` +
        `This is well above the school's 85% minimum threshold. No action needed at this stage.`
      );
    }

    // Strengths
    if (q.match(/strength|good at|excel|best|top|talent|gifted/)) {
      return (
        `**${CHILD.name}'s Strengths**\n\n` +
        `Here is where ${CHILD.name} clearly stands out this term:\n\n` +
        `• **Analytical Thinking** — Problem-solving in Physics and Mathematics is consistently above average\n` +
        `• **Historical Analysis** — Top of class, A+ every assessment. Ms. Garcia has recommended the Regional History Essay Competition\n` +
        `• **Lab Work & Science** — Dr. Patel notes exceptional experimental accuracy and genuine curiosity in Physics\n` +
        `• **Reliability** — Perfect attendance for 6 consecutive weeks; all work submitted on time recently\n\n` +
        `${CHILD.name} has a strong analytical mind. The Science Olympiad opportunity is one worth exploring — Dr. Patel personally recommended it.`
      );
    }

    // Weaknesses
    if (q.match(/weak|struggle|concern|worry|problem|issue|trouble|need.*work|improv/)) {
      return (
        `**Areas to Improve — ${CHILD.name}**\n\n` +
        `These are the priority areas to address this term:\n\n` +
        `• **Essay Structure** *(medium priority)* — English is sitting at 76/100. Mrs. Davis highlighted that argument flow and paragraph cohesion are the main gaps. This is ${CHILD.name}'s lowest score relative to the standard set in other subjects.\n` +
        `• **Biology** *(medium priority)* — A recent dip to 74/100 suggests a gap in cellular biology concepts. This is worth addressing before it compounds.\n` +
        `• **Deadline Management** *(low priority)* — Two late submissions in Q1, though there has been no recurrence since. Worth monitoring, not urgent.\n\n` +
        `Overall there is nothing alarming — ${CHILD.name} is still in the top 20% of the year. These are refinement areas, not rescue scenarios.`
      );
    }

    // What Alex needs / action plan / suggestions
    if (q.match(/need|suggest|action|plan|help.*alex|recommend|what.*do|advice|next step/)) {
      return (
        `**Action Plan for ${CHILD.name}**\n\n` +
        `Based on current performance, here is what I recommend focusing on:\n\n` +
        `**🔴 High Priority**\n` +
        `• **Strengthen Essay Writing** — 2–3 short practice essays per week on argument structure and paragraph cohesion. Ask Mrs. Davis for a self-assessment rubric.\n` +
        `• **Review Biology Fundamentals** — 30 min/day on Khan Academy's Cell Biology unit. Should close the gap within 2–3 weeks.\n\n` +
        `**🟡 Medium Priority**\n` +
        `• **Chapter 8 Math Test** — Algebra proofs test is next Friday. Practice 5 problems nightly this week to hold the current A.\n\n` +
        `**✨ Opportunity**\n` +
        `• **Science Olympiad** — Dr. Patel nominated ${CHILD.name} as a strong candidate. Excellent for advanced learning and college applications.\n\n` +
        `Would you like me to suggest specific tutors or materials for any of these?`
      );
    }

    // Materials / resources
    if (q.match(/material|resource|book|course|video|tool|grammarly|khan|online|learn/)) {
      return (
        `**Suggested Learning Materials for ${CHILD.name}**\n\n` +
        `Here are the resources I recommend based on the current gaps:\n\n` +
        `**For English (Essay Writing)**\n` +
        `• *The Elements of Style* by Strunk & White — concise, practical, directly addresses structure issues\n` +
        `• **Grammarly Premium** — real-time AI feedback that trains good writing habits over time\n\n` +
        `**For Biology**\n` +
        `• **Khan Academy — Biology** *(Free)* — Cell Biology and Genetics units, self-paced with instant feedback quizzes\n\n` +
        `**For History (enrichment)**\n` +
        `• **Crash Course History** on YouTube — engaging, well-structured AP-level review series\n\n` +
        `All of these can be started immediately. Would you like me to help connect ${CHILD.name} with a tutor instead?`
      );
    }

    // Tutors
    if (q.match(/tutor|coach|teacher|private.*lesson|lesson|help.*find/)) {
      return (
        `**Tutors Near You — for ${CHILD.name}**\n\n` +
        `Based on the priority subjects, here are three highly-rated tutors I recommend:\n\n` +
        `**Sarah Mitchell** — English & Writing · ★ 4.9 (42 reviews)\n` +
        `$45/hr · 1.2 mi away · Mon, Wed, Fri\n` +
        `*Directly addresses the essay structure gap Mrs. Davis flagged.*\n\n` +
        `**James Okafor** — Biology & Chemistry · ★ 4.8 (28 reviews)\n` +
        `$40/hr · 2.4 mi away · Tue, Thu, Sat · Also available online\n` +
        `*Specialises in exactly the cellular biology area where ${CHILD.name} dipped.*\n\n` +
        `**Priya Nair** — Mathematics & Physics · ★ 4.7 (65 reviews)\n` +
        `$50/hr · 0.8 mi away · Flexible hours\n` +
        `*Closest to you — great for keeping the current A in Math.*\n\n` +
        `Would you like Zaki to help you book a session with any of them?`
      );
    }

    // Upcoming / events / schedule
    if (q.match(/upcom|event|next|schedule|week|soon|calendar/)) {
      return (
        `**Upcoming for ${CHILD.name}**\n\n` +
        CHILD.upcomingEvents.map(e => `• **${e.title}** — ${e.date}`).join('\n') +
        `\n\n**Key note:** The Parent-Teacher Conference on 15 Nov is the most important near-term date. This is your opportunity to discuss the English essay progress directly with Mrs. Davis. I'd suggest preparing a few specific questions beforehand — particularly around the writing rubric and what excellent looks like in her marking.\n\n` +
        `The Science Fair on 20 Nov is also relevant — ${CHILD.name} may wish to enter given the Physics strengths Dr. Patel has highlighted.`
      );
    }

    // Summary / overview
    if (q.match(/summar|overview|how.*doing|overall|report|this term|snapshot/)) {
      return (
        `**Term 3 Summary — ${CHILD.name}**\n\n` +
        `**GPA:** ${CHILD.gpa} · **Rank:** #${CHILD.classRank} of ${CHILD.rankOf} students\n` +
        `**Attendance:** ${CHILD.attendance}% · ${CHILD.absences} absences · 0 missing assignments\n\n` +
        `**Top subjects:** History (A+ · 95), Physics (A · 92), Mathematics (A · 88)\n` +
        `**Watch areas:** English (B+ · 76), Biology (B · 74)\n\n` +
        `${CHILD.name} is performing well — no attendance or behavioural concerns. The two areas to address are essay writing in English and a recent dip in Biology. Both are very manageable with targeted support.\n\n` +
        `Next milestone: **Parent-Teacher Conference on 15 Nov 2026**.\n\n` +
        `*Ask me about strengths, weaknesses, tutor recommendations, or learning materials for more detail.*`
      );
    }

    return (
      `I'm Zaki, your AI companion for tracking ${CHILD.name}'s progress at ${CHILD.school}.\n\n` +
      `**Quick snapshot:**\n` +
      `• **GPA:** ${CHILD.gpa} · #${CHILD.classRank} of ${CHILD.rankOf} students\n` +
      `• **Attendance:** ${CHILD.attendance}% · ${CHILD.absences} absences\n` +
      `• **Missing work:** ${CHILD.missingWork}\n\n` +
      `**Things you can ask me:**\n` +
      `• "How is Alex performing this term?"\n` +
      `• "What are Alex's strengths and weaknesses?"\n` +
      `• "What does Alex need to improve?"\n` +
      `• "Suggest some learning materials"\n` +
      `• "Find me tutors near me"\n` +
      `• "Any concerns I should know about?"`
    );
  }
}
