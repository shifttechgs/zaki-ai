import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LowerCasePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-parent-dashboard',
  standalone: true,
  imports: [LowerCasePipe, MatIconModule],
  templateUrl: './parent-dashboard.component.html',
  styleUrl: './parent-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParentDashboardComponent {
  readonly today = new Date();

  readonly stats = [
    { label: "Child's GPA", value: '3.7', sub: 'Alex Johnson · Gr. 10', icon: 'school', color: 'purple' },
    { label: 'Attendance', value: '94%', sub: '2 absences this term', icon: 'event_available', color: 'green' },
    { label: 'Missing Work', value: '0', sub: 'all caught up', icon: 'check_circle', color: 'green' },
    { label: 'Class Rank', value: 'Top 20%', sub: 'out of 180 students', icon: 'emoji_events', color: 'amber' },
  ];

  readonly activity = [
    { id: 1, type: 'grade', text: 'Mathematics · A · Algebra Test', time: '2 hours ago', icon: 'grade' },
    { id: 2, type: 'present', text: 'Present all 5 days this week', time: 'Today', icon: 'event_available' },
    { id: 3, type: 'grade', text: 'Physics · A · Lab Report', time: '3 days ago', icon: 'grade' },
    { id: 4, type: 'message', text: 'Message from Mrs. Davis (English)', time: '4 days ago', icon: 'chat' },
    { id: 5, type: 'grade', text: 'English · B+ · Essay Draft', time: '1 week ago', icon: 'grade' },
    { id: 6, type: 'absent', text: 'Absence recorded', time: 'Last Monday', icon: 'event_busy' },
  ];

  readonly events = [
    { id: 1, title: 'Parent-Teacher Conference', date: '15 Nov 2026', tag: 'School' },
    { id: 2, title: 'Science Fair', date: '20 Nov 2026', tag: 'Event' },
    { id: 3, title: 'Thanksgiving Break', date: '27 Nov 2026', tag: 'Holiday' },
    { id: 4, title: 'End of Term', date: '20 Dec 2026', tag: 'Academic' },
  ];

  readonly messages = [
    {
      id: 1,
      from: 'Mrs. Davis',
      subject: 'English Literature',
      preview: 'Alex has been showing great improvement in essay writing…',
      time: '4 days ago',
    },
    {
      id: 2,
      from: 'Mr. Thompson',
      subject: 'Mathematics',
      preview: 'Reminder: Chapter 8 test is scheduled for next Friday…',
      time: '6 days ago',
    },
  ];
}
