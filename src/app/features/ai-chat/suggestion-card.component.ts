import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-suggestion-card',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './suggestion-card.component.html',
  styleUrl: './suggestion-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuggestionCardComponent {
  icon = input.required<string>();
  title = input.required<string>();
  description = input.required<string>();
  gradient = input<string>('linear-gradient(135deg, #6366F1 0%, #7C3AED 100%)');
  selected = output<void>();
}
