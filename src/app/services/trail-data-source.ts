import { Injectable } from '@angular/core';
import { Trail } from '../shared/models/trail';
import { SEED_TRAILS } from '../shared/data/seed-trails';

// The abstract class is the DI token. Unlike an interface, an abstract class
// still exists at runtime, so Angular can use it as a lookup key. Code asks
// for TrailDataSource, and app.config.ts decides which subclass it receives.
export abstract class TrailDataSource {
  abstract load(): readonly Trail[];
}

// Not a root singleton on its own: it is only created when a provider
// (useClass in app.config.ts) asks for it, so it uses plain @Injectable().
@Injectable()
export class LocalTrailDataSource extends TrailDataSource {
  load(): readonly Trail[] {
    return SEED_TRAILS;
  }
}

@Injectable()
export class DemoTrailDataSource extends TrailDataSource {
  load(): readonly Trail[] {
    return [
      {
        id: 101,
        name: 'Demo Lakeshore Stroll',
        region: 'Demo data',
        distanceKm: 2,
        elevationGainM: 5,
        difficulty: 'easy',
        surface: 'paved',
        dogFriendly: true,
        description: 'Served by DemoTrailDataSource. Swap the provider back to see the real list.',
      },
      {
        id: 102,
        name: 'Demo Ridge Scramble',
        region: 'Demo data',
        distanceKm: 7.5,
        elevationGainM: 260,
        difficulty: 'hard',
        surface: 'rock',
        dogFriendly: false,
      },
    ];
  }
}
