import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-parent-placeholder',
  standalone: true,
  imports: [MatIconModule, RouterLink],
  template: `
    <div class="wrap">
      <div class="card">
        <div class="icon-wrap">
          <mat-icon>{{ data.icon }}</mat-icon>
        </div>
        <h1>{{ data.feature }}</h1>
        <p class="desc">{{ data.description }}</p>
        <span class="badge">
          <mat-icon>schedule</mat-icon>
          Coming soon
        </span>
        <a class="cta" [routerLink]="['/dashboard/parent/ai-chat']">
          <mat-icon>auto_awesome</mat-icon>
          Ask Zaki AI instead
        </a>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .wrap {
      display: flex; align-items: center; justify-content: center;
      min-height: 100%; padding: 60px 32px; background: #F7F9FC;
    }
    .card {
      background: #fff; border: 1px solid #E8EDF2; border-radius: 18px;
      padding: 52px 48px; max-width: 480px; width: 100%;
      text-align: center;
      box-shadow: 0 1px 3px rgba(10,37,64,.04), 0 8px 28px rgba(10,37,64,.06);
    }
    .icon-wrap {
      width: 64px; height: 64px; border-radius: 16px;
      background: #F5F3FF; display: flex; align-items: center;
      justify-content: center; margin: 0 auto 24px;
      mat-icon { font-size: 30px; width: 30px; height: 30px; line-height: 30px; color: #7C3AED; }
    }
    h1 {
      font-size: 22px; font-weight: 800; color: #0A2540;
      margin: 0 0 12px; letter-spacing: -.02em;
    }
    .desc {
      font-size: 14px; color: #697386; margin: 0 0 24px; line-height: 1.6;
    }
    .badge {
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 12px; font-weight: 700; color: #D97706;
      background: #FFFBEB; border: 1px solid rgba(217,119,6,.2);
      border-radius: 100px; padding: 5px 14px; margin-bottom: 28px;
      mat-icon { font-size: 14px; width: 14px; height: 14px; line-height: 14px; }
    }
    .cta {
      display: inline-flex; align-items: center; gap: 7px;
      background: #7C3AED; color: #fff; border-radius: 100px;
      font-size: 13.5px; font-weight: 700; padding: 11px 22px;
      text-decoration: none; box-shadow: 0 4px 14px rgba(124,58,237,.4);
      transition: background .15s;
      mat-icon { font-size: 16px; width: 16px; height: 16px; line-height: 16px; }
      &:hover { background: #6D28D9; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParentPlaceholderComponent {
  readonly data = inject(ActivatedRoute).snapshot.data as {
    feature: string;
    icon: string;
    description: string;
  };
}
