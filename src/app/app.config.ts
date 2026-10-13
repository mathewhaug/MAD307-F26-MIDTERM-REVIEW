import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { TRAILHEAD_CONFIG } from './shared/config/trailhead-config';
import { HIKE_ID, hikeIdFactory } from './shared/config/hike-id';
import { LocalTrailDataSource, TrailDataSource } from './services/trail-data-source';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // useValue: provide a ready-made value for a token.
    {
      provide: TRAILHEAD_CONFIG,
      useValue: { appName: 'Trailhead', paceKmPerHour: 4, storageKey: 'trailhead.favourites' },
    },
    // useFactory: Angular calls the function and provides whatever it returns.
    { provide: HIKE_ID, useFactory: hikeIdFactory },
    // useClass: when someone asks for TrailDataSource, create this class instead.
    // Swap to DemoTrailDataSource to see the useClass recipe in action. TrailService does not change.
    { provide: TrailDataSource, useClass: LocalTrailDataSource },
  ],
};
