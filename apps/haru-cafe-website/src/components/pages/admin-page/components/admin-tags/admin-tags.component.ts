import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
    RestaurantCatalogClients,
    TagsStore,
} from '@meadsoft/restaurant-catalog-client-angular';
import type { ITag } from '@meadsoft/restaurant-catalog-contracts';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'haru-admin-tags',
    imports: [CommonModule, ButtonModule, DialogModule, InputTextModule, TableModule],
    templateUrl: './admin-tags.component.html',
})
export class AdminTagsComponent {
    private readonly clients = inject(RestaurantCatalogClients);
    private readonly tagsStore = inject(TagsStore);

    readonly tags = this.tagsStore.resource;

    readonly showDialog = signal(false);
    readonly editingTag = signal<ITag | null>(null);
    readonly saving = signal(false);
    readonly error = signal<string | null>(null);
    readonly formName = signal('');

    openCreate(): void {
        this.editingTag.set(null);
        this.formName.set('');
        this.error.set(null);
        this.showDialog.set(true);
    }

    openEdit(tag: ITag): void {
        this.editingTag.set(tag);
        this.formName.set(tag.name);
        this.error.set(null);
        this.showDialog.set(true);
    }

    closeDialog(): void {
        this.showDialog.set(false);
        this.editingTag.set(null);
    }

    async save(): Promise<void> {
        if (!this.formName().trim()) {
            this.error.set('Name is required.');
            return;
        }
        this.saving.set(true);
        this.error.set(null);
        try {
            const editing = this.editingTag();
            if (editing) {
                await this.clients.tags.update(editing.id, {
                    ...editing,
                    name: this.formName().trim(),
                });
            } else {
                await this.clients.tags.createOne({ name: this.formName().trim() });
            }
            this.tagsStore.resource.reload();
            this.closeDialog();
        } catch (e) {
            this.error.set(e instanceof Error ? e.message : 'Save failed.');
        } finally {
            this.saving.set(false);
        }
    }

    async deleteTag(tag: ITag): Promise<void> {
        if (!confirm(`Delete tag "${tag.name}"?`)) return;
        try {
            await this.clients.tags.delete(tag.id);
            this.tagsStore.resource.reload();
        } catch (e) {
            alert(e instanceof Error ? e.message : 'Delete failed.');
        }
    }
}
