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
  readonly stats = [
    { label: 'GPA', value: '3.7', sub: 'Top 20% · Grade 10', icon: 'school', color: 'purple' },
    { label: 'Attendance', value: '94%', sub: '2 absences this term', icon: 'event_available', color: 'green' },
    { label: 'Missing Work', value: '0', sub: 'All assignments submitted', icon: 'check_circle', color: 'green' },
    { label: 'Class Rank', value: '#36', sub: 'out of 180 students', icon: 'emoji_events', color: 'amber' },
  ];

  readonly subjects = [
    { name: 'History',     grade: 'A+', score: 95, teacher: 'Ms. Garcia',   color: 'amber',  watch: false },
    { name: 'Physics',     grade: 'A',  score: 92, teacher: 'Dr. Patel',    color: 'green',  watch: false },
    { name: 'Mathematics', grade: 'A',  score: 88, teacher: 'Mr. Thompson', color: 'purple', watch: false },
    { name: 'English',     grade: 'B+', score: 76, teacher: 'Mrs. Davis',   color: 'blue',   watch: true  },
    { name: 'Biology',     grade: 'B',  score: 74, teacher: 'Mr. Chen',     color: 'red',    watch: true  },
  ];

  readonly focusAreas = [
    {
      id: 1,
      subject: 'English',
      title: 'Essay Writing',
      quote: '"Alex struggles with paragraph structure and argument flow — there is real room to improve here."',
      teacher: 'Mrs. Davis · English Literature',
      detail: 'Practice 2 short essays per week focusing on argument structure. Ask Mrs. Davis for her marking rubric to guide home study.',
      color: 'amber',
      icon: 'edit',
    },
    {
      id: 2,
      subject: 'Biology',
      title: 'Cell Biology',
      quote: null,
      teacher: 'Mr. Chen · Biology',
      detail: 'A dip to 74/100 on the last test points to a gap in the cellular biology unit. 20–30 min daily on Khan Academy will close this within 2–3 weeks.',
      color: 'red',
      icon: 'biotech',
    },
  ];

}
