import { Component, computed, inject } from '@angular/core';
import { TrailService } from '../services/trail.service';
import { HikeLogService } from '../services/hike-log.service';

@Component({
  selector: 'app-trail-detail',
  templateUrl: './trail-detail.html',
  styleUrl: './trail-detail.scss',
})
export class TrailDetail {
  private readonly trailService = inject(TrailService);
  protected readonly hikeLog = inject(HikeLogService);

  // No input any more: the selection is read straight from the service.
  protected readonly trail = this.trailService.selectedTrail;

  // Re-runs when the selection changes or when a new hike is logged,
  // because logsFor() reads the logs signal.
  protected readonly logs = computed(() => {
    const trail = this.trail();
    return trail ? this.hikeLog.logsFor(trail.id) : [];
  });
}
