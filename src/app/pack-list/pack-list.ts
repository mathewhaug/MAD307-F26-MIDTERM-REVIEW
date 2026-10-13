// Provider hierarchy demo.
//
// `providers: [PackListStore]` below registers the store on this component's
// own injector. Every <app-pack-list> instance therefore gets its OWN
// PackListStore: adding an item to the day pack does not touch the overnight pack.
//
// When a component calls inject(), Angular looks in that component's injector
// first, then walks up the component tree (parent, grandparent, ...) and
// finally reaches the root injector. TrailService is found at the root
// (@Service() provides it there), which is why every component shares one copy.
import { Component, inject, input, signal } from '@angular/core';
import { PackListStore } from './pack-list-store';

@Component({
  selector: 'app-pack-list',
  providers: [PackListStore],
  templateUrl: './pack-list.html',
  styleUrl: './pack-list.scss',
})
export class PackList {
  readonly label = input.required<string>();
  protected readonly store = inject(PackListStore);

  // What the user is typing, before it is added.
  protected readonly draft = signal('');

  protected onDraft(event: Event): void {
    this.draft.set((event.target as HTMLInputElement).value);
  }

  protected addItem(): void {
    // The store ignores empty or whitespace-only names.
    this.store.add(this.draft());
    this.draft.set('');
  }
}
