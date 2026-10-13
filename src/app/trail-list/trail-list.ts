import { Component, inject } from '@angular/core';
import { TrailCard } from '../trail-card/trail-card';
import { DIFFICULTIES, isDifficulty } from '../shared/models/trail';
import { TrailService } from '../services/trail.service';

@Component({
  selector: 'app-trail-list',
  imports: [TrailCard],
  templateUrl: './trail-list.html',
  styleUrl: './trail-list.scss',
})
export class TrailList {
  // All state now lives in TrailService. This component only reads it and
  // forwards user events to the service.
  protected readonly trailService = inject(TrailService);
  protected readonly difficulties = DIFFICULTIES;

  protected onSearch(event: Event): void {
    this.trailService.setSearch((event.target as HTMLInputElement).value);
  }

  protected onDifficulty(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    // Only accept values we know about. After the check, TypeScript knows
    // value is Difficulty | 'all', so no cast is needed.
    if (value === 'all' || isDifficulty(value)) {
      this.trailService.setDifficulty(value);
    }
  }

  protected onDogFriendly(event: Event): void {
    this.trailService.setDogFriendlyOnly((event.target as HTMLInputElement).checked);
  }
}
