import { Service, computed, effect, inject, linkedSignal, signal } from '@angular/core';
import { Difficulty, Trail } from '../shared/models/trail';
import { TRAILHEAD_CONFIG } from '../shared/config/trailhead-config';
import { logCall } from '../shared/decorators/log-call';
import { TrailDataSource } from './trail-data-source';

// @Service() is shorthand for @Injectable({ providedIn: 'root' }): one shared
// instance for the whole app. Every component that injects TrailService gets
// the same object, so they all see the same state.
@Service()
export class TrailService {
  // inject() in a field initializer. No constructor parameters needed.
  private readonly dataSource = inject(TrailDataSource);
  private readonly config = inject(TRAILHEAD_CONFIG);

  // Private writable state. Only this service can change it.
  private readonly _trails = signal<readonly Trail[]>(this.dataSource.load());
  private readonly _search = signal('');
  private readonly _difficultyFilter = signal<Difficulty | 'all'>('all');
  private readonly _dogFriendlyOnly = signal(false);
  private readonly _favouriteIds = signal<readonly number[]>(this.loadFavourites());

  // Public read only views. Components can read these but cannot call set().
  readonly trails = this._trails.asReadonly();
  readonly search = this._search.asReadonly();
  readonly difficultyFilter = this._difficultyFilter.asReadonly();
  readonly dogFriendlyOnly = this._dogFriendlyOnly.asReadonly();
  readonly favouriteIds = this._favouriteIds.asReadonly();

  readonly filteredTrails = computed(() => {
    const term = this._search().trim().toLowerCase();
    const difficulty = this._difficultyFilter();
    const dogsOnly = this._dogFriendlyOnly();

    return this._trails().filter(
      (trail) =>
        (term === '' ||
          trail.name.toLowerCase().includes(term) ||
          trail.region.toLowerCase().includes(term)) &&
        (difficulty === 'all' || trail.difficulty === difficulty) &&
        (!dogsOnly || trail.dogFriendly),
    );
  });

  readonly favouriteCount = computed(() => this._favouriteIds().length);

  // linkedSignal: follows filteredTrails, but can also be set by select().
  // `previous` lets us keep the current selection when it is still visible.
  private readonly _selectedTrail = linkedSignal<readonly Trail[], Trail | undefined>({
    source: this.filteredTrails,
    computation: (list, previous) =>
      list.find((trail) => trail.id === previous?.value?.id) ?? list[0],
  });
  readonly selectedTrail = this._selectedTrail.asReadonly();

  // effect() needs an injection context. A field initializer runs inside one
  // (just like inject()), so effects can be created right here.
  private readonly saveFavourites = effect(() => {
    const ids = this._favouriteIds();
    try {
      localStorage.setItem(this.config.storageKey, JSON.stringify(ids));
    } catch {
      // Storage can be full or blocked (for example in private browsing). Not fatal.
    }
  });

  // Moved here from TrailList in Part 4: a side effect on the browser tab title.
  private readonly syncDocumentTitle = effect(() => {
    document.title = `${this.config.appName} (${this.filteredTrails().length} trails)`;
  });

  setSearch(term: string): void {
    this._search.set(term);
  }

  setDifficulty(difficulty: Difficulty | 'all'): void {
    this._difficultyFilter.set(difficulty);
  }

  setDogFriendlyOnly(value: boolean): void {
    this._dogFriendlyOnly.set(value);
  }

  // Going further: @logCall logs every call to the console.
  @logCall
  toggleFavourite(id: number): void {
    // Always return a new array. push() would keep the same reference, so the
    // signal would not notify anything that depends on it.
    this._favouriteIds.update((ids) =>
      ids.includes(id) ? ids.filter((favId) => favId !== id) : [...ids, id],
    );
  }

  select(trail: Trail): void {
    this._selectedTrail.set(trail);
  }

  isFavourite(id: number): boolean {
    return this._favouriteIds().includes(id);
  }

  // localStorage holds plain text, so treat what comes back as unknown and
  // check it before trusting it.
  private loadFavourites(): readonly number[] {
    try {
      const stored = localStorage.getItem(this.config.storageKey);
      if (stored === null) {
        return [];
      }
      const parsed: unknown = JSON.parse(stored);
      return isNumberArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
}

function isNumberArray(value: unknown): value is number[] {
  return Array.isArray(value) && value.every((item: unknown) => typeof item === 'number');
}
