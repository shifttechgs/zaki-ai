import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

interface ChartSeries { name: string; color: string; scores: number[]; }

@Component({
  selector: 'app-parent-report',
  standalone: true,
  imports: [MatIconModule, RouterLink],
  templateUrl: './parent-report.component.html',
  styleUrl: './parent-report.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParentReportComponent {
  readonly days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  readonly series: ChartSeries[] = [
    { name: 'Mathematics', color: '#7C3AED', scores: [82, 85, 84, 88, 87, 88, 88] },
    { name: 'Physics',     color: '#059669', scores: [88, 90, 89, 91, 92, 91, 92] },
    { name: 'English',     color: '#2563EB', scores: [72, 74, 73, 75, 76, 75, 76] },
    { name: 'History',     color: '#D97706', scores: [93, 94, 95, 94, 95, 95, 95] },
    { name: 'Biology',     color: '#DC2626', scores: [78, 76, 74, 75, 74, 74, 74] },
  ];

  // SVG chart dimensions
  private readonly CX = 40;   // left padding
  private readonly CY = 14;   // top padding
  private readonly CW = 500;  // usable width
  private readonly CH = 150;  // usable height

  scoreToY(score: number): number {
    return this.CY + this.CH - (score / 100) * this.CH;
  }

  dayToX(i: number): number {
    return this.CX + (i / (this.days.length - 1)) * this.CW;
  }

  linePath(scores: number[]): string {
    return scores.map((s, i) => {
      const x = this.dayToX(i);
      const y = this.scoreToY(s);
      if (i === 0) return `M${x},${y}`;
      const px = this.dayToX(i - 1);
      const py = this.scoreToY(scores[i - 1]);
      const mx = (px + x) / 2;
      return `C${mx},${py} ${mx},${y} ${x},${y}`;
    }).join(' ');
  }

  areaPath(scores: number[]): string {
    const line = this.linePath(scores);
    const lastX = this.dayToX(scores.length - 1);
    const firstX = this.dayToX(0);
    const bottom = this.CY + this.CH;
    return `${line} L${lastX},${bottom} L${firstX},${bottom} Z`;
  }

  // Chart grid lines at scores 20, 40, 60, 80, 100
  readonly gridLines = [100, 80, 60, 40, 20].map(s => ({
    score: s,
    y: this.CY + this.CH - (s / 100) * this.CH,
  }));

  // Study time by subject (minutes per week)
  readonly studyTime = [
    { subject: 'Physics',     minutes: 148, color: '#059669' },
    { subject: 'Mathematics', minutes: 132, color: '#7C3AED' },
    { subject: 'History',     minutes: 120, color: '#D97706' },
    { subject: 'English',     minutes: 105, color: '#2563EB' },
    { subject: 'Biology',     minutes: 97,  color: '#DC2626' },
  ];

  readonly maxMinutes = 160;

  studyBarWidth(minutes: number): number {
    return (minutes / this.maxMinutes) * 100;
  }

  // 5 weeks × 7 days heatmap (study minutes per day)
  readonly heatmap: number[][] = [
    [45, 60, 30,  0, 90, 120, 45],
    [70, 85,  0, 60, 110, 100, 50],
    [80, 95, 70, 75, 120, 110, 65],
    [85, 100, 90,  0, 115, 130, 70],
    [90, 102, 95,  0, 120,   0,  0],
  ];

  heatColor(minutes: number): string {
    if (minutes === 0)   return '#F0F4F8';
    if (minutes < 40)   return '#EDE9FE';
    if (minutes < 75)   return '#C4B5FD';
    if (minutes < 105)  return '#8B5CF6';
    return '#7C3AED';
  }

  heatOpacity(minutes: number): string {
    return minutes === 0 ? '0.5' : '1';
  }

  readonly weekLabels = ['4w ago', '3w ago', '2w ago', 'Last week', 'This week'];
  readonly dayLabels  = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  readonly milestones = [
    { icon: 'local_fire_department', color: '#D97706', bg: '#FFFBEB', label: '7-Day Streak',    date: 'This week',  earned: true  },
    { icon: 'emoji_events',          color: '#059669', bg: '#ECFDF5', label: 'Quiz Master',     date: 'Oct 6',      earned: true  },
    { icon: 'workspace_premium',     color: '#7C3AED', bg: '#F5F3FF', label: 'Top 20% Rank',    date: 'Oct 3',      earned: true  },
    { icon: 'bolt',                  color: '#2563EB', bg: '#EFF6FF', label: '50 Sessions',     date: 'Oct 1',      earned: true  },
    { icon: 'star',                  color: '#9CAAB6', bg: '#F0F4F8', label: 'Perfect Week',    date: 'Locked',     earned: false },
    { icon: 'psychology',            color: '#9CAAB6', bg: '#F0F4F8', label: 'Deep Learner',    date: 'Locked',     earned: false },
  ];

  readonly summaryStats = [
    { label: 'Sessions this week', value: '12',     icon: 'devices',          color: 'purple' },
    { label: 'Total study time',   value: '9h 22m', icon: 'schedule',         color: 'blue'   },
    { label: 'Avg quiz score',     value: '84%',    icon: 'quiz',             color: 'green'  },
    { label: 'Week improvement',   value: '+4.2%',  icon: 'trending_up',      color: 'amber'  },
  ];
}
