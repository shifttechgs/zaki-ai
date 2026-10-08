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
  readonly today = new Date();

  readonly stats = [
    { label: "GPA", value: '3.7', sub: 'Top 20% of class', icon: 'school', color: 'purple' },
    { label: 'Attendance', value: '94%', sub: '2 absences this term', icon: 'event_available', color: 'green' },
    { label: 'Missing Work', value: '0', sub: 'All assignments in', icon: 'check_circle', color: 'green' },
    { label: 'Class Rank', value: '#36', sub: 'out of 180 students', icon: 'emoji_events', color: 'amber' },
  ];

  readonly subjects = [
    { name: 'History', grade: 'A+', score: 95, teacher: 'Ms. Garcia', trend: 'up', color: 'amber' },
    { name: 'Physics', grade: 'A', score: 92, teacher: 'Dr. Patel', trend: 'up', color: 'green' },
    { name: 'Mathematics', grade: 'A', score: 88, teacher: 'Mr. Thompson', trend: 'up', color: 'purple' },
    { name: 'English', grade: 'B+', score: 76, teacher: 'Mrs. Davis', trend: 'stable', color: 'blue' },
    { name: 'Biology', grade: 'B', score: 74, teacher: 'Mr. Chen', trend: 'down', color: 'red' },
  ];

  readonly strengths = [
    { area: 'Analytical Thinking', detail: 'Excels at Physics and Mathematics problem-solving', icon: 'psychology' },
    { area: 'Historical Analysis', detail: 'Top of class in History — consistent A+ performer', icon: 'auto_stories' },
    { area: 'Lab Work & Science', detail: 'Dr. Patel notes exceptional experimental accuracy', icon: 'science' },
    { area: 'Reliability', detail: 'Perfect attendance streak the last 6 consecutive weeks', icon: 'task_alt' },
  ];

  readonly weaknesses = [
    { area: 'Essay Structure', detail: 'Argument flow and paragraph cohesion — English sitting at 76/100', urgency: 'medium', icon: 'edit_note' },
    { area: 'Biology', detail: 'Recent dip to 74/100; cellular biology concepts need targeted review', urgency: 'medium', icon: 'biotech' },
    { area: 'Deadline Management', detail: 'Two late submissions in Q1 — no recurrence since, monitor', urgency: 'low', icon: 'schedule' },
  ];

  readonly teacherComments = [
    {
      id: 1,
      teacher: 'Mrs. Davis',
      subject: 'English Literature',
      comment: 'Alex demonstrates strong reading comprehension but struggles with essay structure and paragraph cohesion. Focused practice on thesis development would make a significant difference this term.',
      date: '4 days ago',
      sentiment: 'constructive',
      avatar: 'D',
    },
    {
      id: 2,
      teacher: 'Dr. Patel',
      subject: 'Physics',
      comment: 'Outstanding lab performance this term. Alex applies concepts intuitively and shows genuine curiosity. A strong candidate for the Science Olympiad team — I would encourage the family to consider it.',
      date: '1 week ago',
      sentiment: 'positive',
      avatar: 'P',
    },
    {
      id: 3,
      teacher: 'Ms. Garcia',
      subject: 'History',
      comment: 'One of my best students this year. Analytical essays show critical thinking well beyond grade level. Alex should strongly consider the Regional History Essay Competition in December.',
      date: '2 weeks ago',
      sentiment: 'positive',
      avatar: 'G',
    },
  ];

  readonly suggestions = [
    {
      id: 1,
      title: 'Strengthen Essay Writing',
      detail: 'Practice 2–3 short essays weekly, focusing on argument structure and transitions. Ask Mrs. Davis for a self-assessment rubric to guide home practice.',
      priority: 'high',
      subject: 'English',
      icon: 'edit',
    },
    {
      id: 2,
      title: 'Review Biology Fundamentals',
      detail: 'A gap in cellular biology is showing. Thirty minutes daily on Khan Academy\'s Cell Biology unit should close this within 2–3 weeks.',
      priority: 'high',
      subject: 'Biology',
      icon: 'biotech',
    },
    {
      id: 3,
      title: 'Explore Science Olympiad',
      detail: 'Dr. Patel personally recommended Alex. Builds advanced science skills, teamwork, and strengthens college applications significantly.',
      priority: 'opportunity',
      subject: 'Physics',
      icon: 'emoji_events',
    },
    {
      id: 4,
      title: 'Prepare for Chapter 8 Math Test',
      detail: 'Algebra proof test is next Friday. Reviewing 5 practice problems nightly this week will maintain the current A.',
      priority: 'medium',
      subject: 'Mathematics',
      icon: 'calculate',
    },
  ];

  readonly materials = [
    {
      id: 1,
      title: 'The Elements of Style',
      type: 'Book',
      detail: 'Strunk & White — gold standard for clear, structured writing. Directly addresses Alex\'s essay weaknesses.',
      icon: 'menu_book',
      tag: 'English',
      tagColor: 'blue',
    },
    {
      id: 2,
      title: 'Khan Academy — Biology',
      type: 'Free Online',
      detail: 'Cell biology and genetics units. Self-paced video lessons with practice quizzes and instant feedback.',
      icon: 'laptop',
      tag: 'Biology',
      tagColor: 'green',
    },
    {
      id: 3,
      title: 'Crash Course History',
      type: 'YouTube Series',
      detail: 'Engaging AP History review series. Reinforces Ms. Garcia\'s curriculum in a memorable way.',
      icon: 'play_circle',
      tag: 'History',
      tagColor: 'amber',
    },
    {
      id: 4,
      title: 'Grammarly Premium',
      type: 'AI Writing Tool',
      detail: 'Real-time AI feedback on essay structure, grammar, and clarity — trains good habits over time.',
      icon: 'spellcheck',
      tag: 'English',
      tagColor: 'blue',
    },
  ];

  readonly tutors = [
    {
      id: 1,
      name: 'Sarah Mitchell',
      subjects: 'English & Creative Writing',
      rating: 4.9,
      reviews: 42,
      rate: '$45/hr',
      distance: '1.2 mi',
      availability: 'Mon · Wed · Fri',
      badge: 'Top Rated',
      badgeColor: 'amber',
      initials: 'SM',
      avatarBg: '#FFF7ED',
      avatarColor: '#D97706',
    },
    {
      id: 2,
      name: 'James Okafor',
      subjects: 'Biology & Chemistry',
      rating: 4.8,
      reviews: 28,
      rate: '$40/hr',
      distance: '2.4 mi',
      availability: 'Tue · Thu · Sat',
      badge: 'Online Available',
      badgeColor: 'green',
      initials: 'JO',
      avatarBg: '#ECFDF5',
      avatarColor: '#059669',
    },
    {
      id: 3,
      name: 'Priya Nair',
      subjects: 'Mathematics & Physics',
      rating: 4.7,
      reviews: 65,
      rate: '$50/hr',
      distance: '0.8 mi',
      availability: 'Flexible hours',
      badge: 'Nearest to You',
      badgeColor: 'purple',
      initials: 'PN',
      avatarBg: '#F5F3FF',
      avatarColor: '#7C3AED',
    },
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
