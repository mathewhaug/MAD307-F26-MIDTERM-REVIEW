// Standalone bootstrapping: there is no NgModule. main.ts calls
// bootstrapApplication(App, appConfig), which makes App the root component
// and registers the providers listed in app.config.ts.
//
// This app is zoneless (zone.js is not installed). Angular re-renders a view
// when a signal it reads changes, or when a template event handler runs.
// Nothing patches setTimeout or fetch behind the scenes.
import { Component, inject, signal } from '@angular/core';
import { TrailList } from './trail-list/trail-list';
import { TrailDetail } from './trail-detail/trail-detail';
import { StatsPanel } from './stats-panel/stats-panel';
import { PackList } from './pack-list/pack-list';
import { TRAILHEAD_CONFIG } from './shared/config/trailhead-config';

@Component({
  selector: 'app-root',
  imports: [TrailList, TrailDetail, StatsPanel, PackList],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly config = inject(TRAILHEAD_CONFIG);

  // The title now comes from the injected config instead of a hard-coded signal.
  protected readonly title = this.config.appName;
  protected readonly showStats = signal(true);

  // The document.title effect() that used to live in TrailList is now in
  // TrailService (see syncDocumentTitle), next to the state it reads.

  protected toggleStats(): void {
    this.showStats.update((shown) => !shown);
  }
}
