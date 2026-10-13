import { Component, computed, inject, input, output } from '@angular/core';
import { Trail } from '../shared/models/trail';
import { TRAILHEAD_CONFIG } from '../shared/config/trailhead-config';

// A presentational component: it receives data through inputs and reports
// user actions through outputs. It does not know where trails come from.
@Component({
  selector: 'app-trail-card',
  templateUrl: './trail-card.html',
  styleUrl: './trail-card.scss',
})
export class TrailCard {
  // Signal inputs. Read them like signals: trail(), isFavourite(), position().
  readonly trail = input.required<Trail>();
  readonly isFavourite = input(false);
  readonly position = input<number>();

  // Outputs. The parent listens with (selected)="..." and (favouriteToggled)="...".
  readonly selected = output<Trail>();
  readonly favouriteToggled = output<number>();

  // A presentational component can still inject configuration. It stays
  // "dumb" about app state: trails and favourites still arrive as inputs.
  private readonly config = inject(TRAILHEAD_CONFIG);

  // A signal input is a signal, so computed() can depend on it. When the
  // parent passes a different trail, this recalculates automatically.
  protected readonly estimatedHours = computed(
    () => this.trail().distanceKm / this.config.paceKmPerHour,
  );

  protected onFavourite(event: Event): void {
    // The star button sits inside the clickable <article>. Without this, the
    // click would bubble up to the article and also select the trail.
    event.stopPropagation();
    this.favouriteToggled.emit(this.trail().id);
  }
}
