import { InjectionToken } from '@angular/core';

export interface TrailheadConfig {
  appName: string;
  paceKmPerHour: number;
  storageKey: string;
}

// An interface cannot be a DI token: interfaces are erased when TypeScript
// compiles to JavaScript, so at runtime there is nothing for Angular to look
// up. An InjectionToken is a real object that stands in for the interface.
// The actual values are provided in app.config.ts and are placeholders by design.
export const TRAILHEAD_CONFIG = new InjectionToken<TrailheadConfig>('trailhead.config');
