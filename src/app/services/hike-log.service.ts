import { Service, computed, inject, signal } from '@angular/core';
import { HikeLog, LoggedTrail } from '../shared/models/hike-log';
import { Trail } from '../shared/models/trail';
import { HIKE_ID } from '../shared/config/hike-id';
import { TRAILHEAD_CONFIG } from '../shared/config/trailhead-config';
import { TrailService } from './trail.service';

@Service()
export class HikeLogService {
  // HIKE_ID was provided with useFactory, so this is the counter function
  // returned by hikeIdFactory().
  private readonly nextId = inject(HIKE_ID);
  private readonly config = inject(TRAILHEAD_CONFIG);
  // A service can inject another service.
  private readonly trailService = inject(TrailService);

  private readonly _logs = signal<readonly HikeLog[]>([]);
  readonly logs = this._logs.asReadonly();

  // Every trail that has been hiked at least once, most hiked first.
  // LoggedTrail is the intersection type Trail & { timesHiked: number }.
  readonly loggedTrails = computed<LoggedTrail[]>(() => {
    const counts = new Map<number, number>();
    for (const log of this._logs()) {
      counts.set(log.trailId, (counts.get(log.trailId) ?? 0) + 1);
    }

    return this.trailService
      .trails()
      .filter((trail) => counts.has(trail.id))
      .map((trail) => ({ ...trail, timesHiked: counts.get(trail.id) ?? 0 }))
      .sort((a, b) => b.timesHiked - a.timesHiked);
  });

  logHike(trail: Trail): void {
    const log: HikeLog = {
      id: this.nextId(),
      trailId: trail.id,
      date: todayIso(),
      minutes: Math.round((trail.distanceKm / this.config.paceKmPerHour) * 60),
    };
    this._logs.update((logs) => [...logs, log]);
  }

  // Reads the logs signal, so it stays reactive when called inside computed()
  // or a template.
  logsFor(trailId: number): readonly HikeLog[] {
    return this._logs().filter((log) => log.trailId === trailId);
  }
}

// Today's date as yyyy-mm-dd in local time. toISOString() would use UTC,
// which is already tomorrow on a Windsor evening.
function todayIso(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}
