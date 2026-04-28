import { ResourceRef } from '@angular/core';
import type { WritableSignal } from '@angular/core';

/**
 * A resource wrapper class that remembers the parameters used to load the resource
 *
 * Updating the params will reactively update the resource with the new params, and
 * the resource will be reloaded using the new params through Angular's Resource API
 */
export interface IResourceStore<TEntity, TParams> {
    readonly params: WritableSignal<TParams>;
    readonly resource: ResourceRef<TEntity>;
}
