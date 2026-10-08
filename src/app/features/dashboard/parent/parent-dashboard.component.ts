import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-parent-dashboard',
  standalone: true,
  imports: [MatIconModule, RouterLink],
  templateUrl: './parent-dashboard.component.html',
  styleUrl: './parent-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParentDashboardComponent {
  // Circumference of ring circle (r=36): 2π×36
  readonly RING_C = 226.2;

  ringOffset(score: number): number {
    return this.RING_C - (score / 100) * this.RING_C;
  }

  readonly stats = [
    { label: 'Overall GPA',    value: '3.7',    sub: 'Top 20% · Grade 10',      icon: 'school',          color: 'purple' },
    { label: 'Attendance',     value: '94%',    sub: '2 absences this term',     icon: 'event_available', color: 'green'  },
    { label: 'Today on Zaki',  value: '1h 42m', sub: '3 quizzes · 2 games',      icon: 'schedule',        color: 'blue'   },
    { label: 'Avg Quiz Score', value: '8.3/10', sub: 'Across 3 quizzes today',   icon: 'quiz',            color: 'amber'  },
  ];

  readonly mastery = [
    { subject: 'History',     score: 95, grade: 'A+', color: '#D97706', track: '#FEF3C7' },
    { subject: 'Physics',     score: 92, grade: 'A',  color: '#059669', track: '#D1FAE5' },
    { subject: 'Mathematics', score: 88, grade: 'A',  color: '#7C3AED', track: '#EDE9FE' },
    { subject: 'English',     score: 76, grade: 'B+', color: '#2563EB', track: '#DBEAFE' },
    { subject: 'Biology',     score: 74, grade: 'B',  color: '#DC2626', track: '#FEE2E2' },
  ];

  readonly todayActivity = [
    { time: '3:42 PM', icon: 'quiz',                text: 'Algebra Quiz',           detail: '8 / 10 correct · 12 min',       color: 'purple' },
    { time: '3:12 PM', icon: 'sports_esports',      text: 'Maths Word Game',        detail: 'Level 7 reached · 18 min',      color: 'green'  },
    { time: '2:30 PM', icon: 'menu_book',           text: 'Biology: Cell Division', detail: 'Chapter 4 completed · 22 min',  color: 'blue'   },
    { time: '2:05 PM', icon: 'quiz',                text: 'History Quiz',           detail: '9 / 10 correct · 8 min',        color: 'amber'  },
    { time: '1:45 PM', icon: 'power_settings_new',  text: 'Zaki device connected',  detail: 'Session started',               color: 'gray'   },
  ];

  readonly aiInsight = {
    sessions: 47,
    finding: 'Written expression needs attention',
    detail: 'Across 12 English sessions, Alex consistently struggles to structure arguments. The pattern appears in 8 of 12 essay-type exercises.',
    confidence: 94,
  };

  readonly focusAreas = [
    {
      id: 1, subject: 'English', title: 'Essay Writing', color: 'amber', icon: 'edit',
      quote: '"Alex struggles with paragraph structure and argument flow — there is real room to improve here."',
      teacher: 'Mrs. Davis · English Literature',
      detail: 'Practice 2 short essays per week on argument structure. Ask Mrs. Davis for her marking rubric.',
    },
    {
      id: 2, subject: 'Biology', title: 'Cell Biology', color: 'red', icon: 'biotech',
      quote: null, teacher: 'Mr. Chen · Biology',
      detail: 'A dip to 74/100 shows a gap in cellular biology. 20–30 min daily on Khan Academy closes this in 2–3 weeks.',
    },
  ];

  readonly achievements = [
    { label: '7-Day Streak',  icon: 'local_fire_department', color: '#D97706', bg: '#FFFBEB', earned: true  },
    { label: 'Quiz Master',   icon: 'emoji_events',          color: '#059669', bg: '#ECFDF5', earned: true  },
    { label: 'Top 20%',       icon: 'workspace_premium',     color: '#7C3AED', bg: '#F5F3FF', earned: true  },
    { label: 'Perfect Week',  icon: 'star',                  color: '#9CAAB6', bg: '#F0F4F8', earned: false },
  ];
}
