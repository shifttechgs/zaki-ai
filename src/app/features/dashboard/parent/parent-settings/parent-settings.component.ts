import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-parent-settings',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './parent-settings.component.html',
  styleUrl: './parent-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParentSettingsComponent {

  // ── Saved toast ──────────────────────────────────────────────────────────────
  readonly saved = signal(false);

  save(): void {
    this.saved.set(true);
    setTimeout(() => this.saved.set(false), 2800);
  }

  // ── Section 1: Content Filters ───────────────────────────────────────────────
  readonly subjects = signal([
    { id: 'math',    name: 'Mathematics',     icon: 'calculate',      enabled: true  },
    { id: 'physics', name: 'Physics',          icon: 'science',        enabled: true  },
    { id: 'history', name: 'History',          icon: 'auto_stories',   enabled: true  },
    { id: 'english', name: 'English',          icon: 'edit_note',      enabled: true  },
    { id: 'biology', name: 'Biology',          icon: 'biotech',        enabled: true  },
    { id: 'cs',      name: 'Computer Science', icon: 'computer',       enabled: true  },
    { id: 'art',     name: 'Art',              icon: 'palette',        enabled: false },
    { id: 'music',   name: 'Music',            icon: 'music_note',     enabled: false },
  ]);

  readonly blockedCategories = signal([
    { id: 'violence', name: 'Violence & Graphic Content',   desc: 'Blocks any violent or disturbing material',          blocked: true  },
    { id: 'adult',    name: 'Adult & Inappropriate Content', desc: 'Filters content not suitable for children',          blocked: true  },
    { id: 'social',   name: 'Social Media References',       desc: 'Prevents discussion of social platforms',            blocked: true  },
    { id: 'news',     name: 'News & Politics',               desc: 'Limits exposure to political or news content',       blocked: false },
    { id: 'gaming',   name: 'Non-educational Gaming',        desc: 'Restricts entertainment-only game references',       blocked: false },
  ]);

  toggleSubject(id: string): void {
    this.subjects.update(s => s.map(x => x.id === id ? { ...x, enabled: !x.enabled } : x));
  }

  toggleCategory(id: string): void {
    this.blockedCategories.update(c => c.map(x => x.id === id ? { ...x, blocked: !x.blocked } : x));
  }

  // ── Section 2: Screen Time ───────────────────────────────────────────────────
  readonly dailyLimitEnabled  = signal(true);
  readonly dailyLimitHours    = signal(3);
  readonly sessionLimitEnabled = signal(true);
  readonly sessionLimitMins   = signal(45);

  readonly schedule = signal([
    { day: 'Monday',    short: 'Mon', enabled: true,  from: '15:00', to: '20:00' },
    { day: 'Tuesday',   short: 'Tue', enabled: true,  from: '15:00', to: '20:00' },
    { day: 'Wednesday', short: 'Wed', enabled: true,  from: '15:00', to: '20:00' },
    { day: 'Thursday',  short: 'Thu', enabled: true,  from: '15:00', to: '20:00' },
    { day: 'Friday',    short: 'Fri', enabled: true,  from: '15:00', to: '21:00' },
    { day: 'Saturday',  short: 'Sat', enabled: true,  from: '09:00', to: '20:00' },
    { day: 'Sunday',    short: 'Sun', enabled: true,  from: '09:00', to: '20:00' },
  ]);

  readonly timeOptions = Array.from({ length: 17 }, (_, i) => {
    const h = i + 6;
    const label = h < 12 ? `${h}:00 AM` : h === 12 ? '12:00 PM' : `${h - 12}:00 PM`;
    return { label, value: `${String(h).padStart(2, '0')}:00` };
  });

  setDailyLimit(e: Event): void {
    this.dailyLimitHours.set(+(e.target as HTMLInputElement).value);
  }

  setSessionLimit(e: Event): void {
    this.sessionLimitMins.set(+(e.target as HTMLInputElement).value);
  }

  toggleScheduleDay(day: string): void {
    this.schedule.update(s => s.map(d => d.day === day ? { ...d, enabled: !d.enabled } : d));
  }

  setScheduleTime(day: string, field: 'from' | 'to', e: Event): void {
    const v = (e.target as HTMLSelectElement).value;
    this.schedule.update(s => s.map(d => d.day === day ? { ...d, [field]: v } : d));
  }

  // ── Section 3: Activity Controls ─────────────────────────────────────────────
  readonly features = signal([
    { id: 'quiz',       name: 'Quiz Mode',           icon: 'quiz',             desc: 'Practice quizzes on studied topics',            enabled: true  },
    { id: 'games',      name: 'Educational Games',   icon: 'sports_esports',   desc: 'Gamified learning activities and challenges',   enabled: true  },
    { id: 'ai-chat',    name: 'AI Chat',              icon: 'auto_awesome',     desc: 'Conversational AI to answer questions',         enabled: true  },
    { id: 'study',      name: 'Study Mode',           icon: 'menu_book',        desc: 'Focused reading and content review',            enabled: true  },
    { id: 'practice',   name: 'Practice Tests',       icon: 'assignment',       desc: 'Timed exam simulations and test prep',          enabled: true  },
    { id: 'flashcards', name: 'Flashcards',           icon: 'style',            desc: 'Memory cards for recall and retention',         enabled: true  },
    { id: 'leaderboard',name: 'Leaderboard',          icon: 'emoji_events',     desc: 'Competitive rankings with other Zaki users',    enabled: false },
    { id: 'social',     name: 'Social Learning',      icon: 'people',           desc: 'Collaborative study sessions with peers',       enabled: false },
  ]);

  toggleFeature(id: string): void {
    this.features.update(f => f.map(x => x.id === id ? { ...x, enabled: !x.enabled } : x));
  }

  // ── Section 4: Notifications ─────────────────────────────────────────────────
  readonly notifications = signal([
    { id: 'quiz-done',  name: 'Quiz Completed',   desc: 'When Alex finishes any quiz',               enabled: true  },
    { id: 'low-score',  name: 'Low Score Alert',  desc: 'When Alex scores below 70% on a quiz',      enabled: true  },
    { id: 'daily',      name: 'Daily Summary',    desc: 'End-of-day activity report via email',      enabled: true  },
    { id: 'milestone',  name: 'Achievements',     desc: 'When Alex earns a badge or milestone',      enabled: true  },
    { id: 'inactive',   name: 'Inactivity Alert', desc: 'When Alex hasn\'t used Zaki for 2+ days',   enabled: false },
    { id: 'weekly',     name: 'Weekly Report',    desc: 'Full performance email every Sunday',        enabled: false },
  ]);

  readonly notifEmail = signal('parent@demo.com');

  toggleNotification(id: string): void {
    this.notifications.update(n => n.map(x => x.id === id ? { ...x, enabled: !x.enabled } : x));
  }

  setNotifEmail(e: Event): void {
    this.notifEmail.set((e.target as HTMLInputElement).value);
  }

  // ── Section 5: Parental PIN ──────────────────────────────────────────────────
  readonly pinEnabled   = signal(true);
  readonly pinVisible   = signal(false);
  readonly pin          = signal('1234');
  readonly changingPin  = signal(false);
  readonly newPin       = signal('');

  togglePinVisibility(): void { this.pinVisible.update(v => !v); }
  startPinChange(): void { this.changingPin.set(true); this.newPin.set(''); }
  cancelPinChange(): void { this.changingPin.set(false); }

  confirmPinChange(): void {
    if (this.newPin().length === 4) {
      this.pin.set(this.newPin());
      this.changingPin.set(false);
    }
  }

  setNewPin(e: Event): void {
    const v = (e.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 4);
    this.newPin.set(v);
  }
}
