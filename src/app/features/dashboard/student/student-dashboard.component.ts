import { Component, ChangeDetectionStrategy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [DatePipe, MatIconModule],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentDashboardComponent {
  readonly today = new Date();

  readonly stats = [
    { label: 'GPA', value: '3.7', sub: '+0.2 this term', icon: 'trending_up', color: 'purple' },
    { label: 'Attendance', value: '94%', sub: '2 absences this term', icon: 'event_available', color: 'green' },
    { label: 'Due Soon', value: '3', sub: 'assignments pending', icon: 'assignment_late', color: 'amber' },
    { label: 'Credits', value: '45', sub: 'of 120 earned', icon: 'school', color: 'blue' },
  ];

  readonly schedule = [
    { id: 1, time: '08:00', subject: 'Mathematics', teacher: 'Mr. Thompson', room: 'Room 201', status: 'done' },
    { id: 2, time: '10:00', subject: 'English Literature', teacher: 'Mrs. Davis', room: 'Room 105', status: 'current' },
    { id: 3, time: '12:00', subject: 'Lunch Break', teacher: '', room: 'Cafeteria', status: 'upcoming' },
    { id: 4, time: '13:00', subject: 'Physics', teacher: 'Dr. Patel', room: 'Lab 3', status: 'upcoming' },
    { id: 5, time: '15:00', subject: 'History', teacher: 'Ms. Garcia', room: 'Room 302', status: 'upcoming' },
  ];

  readonly assignments = [
    { id: 1, name: 'Algebra Homework #7', subject: 'Mathematics', due: 'Tomorrow', urgent: true },
    { id: 2, name: 'Essay Final Draft', subject: 'English Literature', due: 'In 3 days', urgent: false },
    { id: 3, name: 'Physics Lab Write-up', subject: 'Physics', due: 'In 5 days', urgent: false },
  ];

  readonly grades = [
    { id: 1, subject: 'Mathematics', assignment: 'Algebra Test', letter: 'A', score: '88/100', tier: 'a' },
    { id: 2, subject: 'English', assignment: 'Essay Draft', letter: 'B+', score: '76/100', tier: 'b' },
    { id: 3, subject: 'Physics', assignment: 'Lab Report', letter: 'A', score: '92/100', tier: 'a' },
    { id: 4, subject: 'History', assignment: 'Chapter Quiz', letter: 'A+', score: '95/100', tier: 'a' },
  ];
}
