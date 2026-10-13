import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DIFFICULTIES } from '../shared/models/trail';
import { countBy, sumBy } from '../shared/utils/collections';
import { TrailService } from '../services/trail.service';
import { HikeLogService } from '../services/hike-log.service';

@Component({
  selector: 'app-stats-panel',
  //DatePipe is the only pipe in this app. Pipes are covered in depth in Week 11.
  imports: [DatePipe],
  templateUrl: './stats-panel.html',
  styleUrl: './stats-panel.scss',
})
export class StatsPanel implements OnInit, OnDestroy {
  private readonly trailService = inject(TrailService);
  private readonly hikeLog = inject(HikeLogService);

  // These used to be inputs passed down from App. Now they come from the
  // shared TrailService. Favouriting a trail in the list updates the count
  // here even though no inputs or outputs connect the two components: they
  // both inject the same root instance.
  protected readonly trails = this.trailService.filteredTrails;
  protected readonly favouriteCount = this.trailService.favouriteCount;

  protected readonly difficulties = DIFFICULTIES;
  protected readonly lastUpdated = signal(new Date());

  // A chain of computed signals:
  //   trails -> totalKm -> averageKm
  //   trails -> byDifficulty
  // When the trails change, totalKm recalculates, and that in turn
  // marks averageKm as stale. Each value is cached until a dependency changes.
  protected readonly totalKm = computed(() => sumBy(this.trails(), (t) => t.distanceKm));
  protected readonly averageKm = computed(() =>
    this.trails().length ? this.totalKm() / this.trails().length : 0,
  );
  protected readonly byDifficulty = computed(() =>
    countBy(this.trails(), (t) => t.difficulty, DIFFICULTIES),
  );

  protected readonly totalHikes = computed(() => this.hikeLog.logs().length);
  // loggedTrails is sorted most hiked first, so the first entry is the winner.
  protected readonly mostHiked = computed(() => this.hikeLog.loggedTrails().at(0));

  // ReturnType<typeof setInterval> works in both browser and Node typings.
  private intervalId: ReturnType<typeof setInterval> | undefined;

  // The constructor runs when the class is created, before Angular has set
  // any inputs, so keep it (and field initializers) for simple setup and
  // inject() calls. ngOnInit runs once after the first inputs are set, which
  // makes it the place to start work such as timers.
  ngOnInit(): void {
    // Toggle the stats panel in the app and watch the console: this logs each
    // time the panel is created, and ngOnDestroy logs each time it is removed.
    console.log('StatsPanel: ngOnInit, starting the clock');
    // Setting a signal from a timer is enough to re-render in a zoneless app.
    this.intervalId = setInterval(() => this.lastUpdated.set(new Date()), 1000);
  }

  ngOnDestroy(): void {
    console.log('StatsPanel: ngOnDestroy, stopping the clock');
    // Without this the interval would keep running after the panel is gone.
    clearInterval(this.intervalId);
  }
}
