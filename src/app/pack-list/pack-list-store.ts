import { Injectable, computed, signal } from '@angular/core';

export interface PackItem {
  id: number;
  name: string;
  packed: boolean;
}

// @Injectable() with no providedIn: this class is NOT a root singleton.
// It only exists where a component lists it in its own `providers` array.
@Injectable()
export class PackListStore {
  private nextId = 1;

  private readonly _items = signal<readonly PackItem[]>([]);
  readonly items = this._items.asReadonly();
  readonly packedCount = computed(() => this._items().filter((item) => item.packed).length);

  add(name: string): void {
    const trimmed = name.trim();
    if (trimmed === '') {
      return;
    }
    this._items.update((items) => [...items, { id: this.nextId++, name: trimmed, packed: false }]);
  }

  toggle(id: number): void {
    this._items.update((items) =>
      items.map((item) => (item.id === id ? { ...item, packed: !item.packed } : item)),
    );
  }
}
