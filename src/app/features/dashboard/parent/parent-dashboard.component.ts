import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LowerCasePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-parent-dashboard',
  standalone: true,
  imports: [LowerCasePipe, MatIconModule, RouterLink],
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

  readonly messages = [
    {
      id: 1,
      from: 'Mrs. Davis',
      subject: 'English Literature',
      preview: 'Alex has strong reading comprehension but the last essay draft needs work on structure and paragraph cohesion — worth addressing before the next assignment.',
      time: '4 days ago',
      unread: true,
    },
    {
      id: 2,
      from: 'Dr. Patel',
      subject: 'Physics',
      preview: 'Outstanding lab session this week. I\'d strongly encourage Alex to consider the Science Olympiad team — it would be a great fit.',
      time: '1 week ago',
      unread: false,
    },
    {
      id: 3,
      from: 'Mr. Thompson',
      subject: 'Mathematics',
      preview: 'Chapter 8 algebra test is next Friday. Alex has been very solid this term — a bit of revision this week should be enough.',
      time: '6 days ago',
      unread: true,
    },
  ];

  readonly events = [
    { id: 1, title: 'Parent-Teacher Conference', date: '15 Nov', tag: 'School' },
    { id: 2, title: 'Science Fair', date: '20 Nov', tag: 'Event' },
    { id: 3, title: 'Thanksgiving Break', date: '27 Nov', tag: 'Holiday' },
    { id: 4, title: 'End of Term', date: '20 Dec', tag: 'Academic' },
  ];
}
