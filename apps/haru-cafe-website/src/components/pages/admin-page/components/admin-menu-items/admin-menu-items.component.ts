import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    MenuItemsWithRelationsStore,
    RestaurantCatalogClients,
    SizesStore,
    TagsStore,
} from '@meadsoft/restaurant-catalog-http-client-angular';
import type {
    IMenuItemWithRelations,
    INewMenuItem,
} from '@meadsoft/restaurant-catalog-contracts';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';

interface SelectOption {
    label: string;
    value: string;
}

@Component({
    selector: 'haru-admin-menu-items',
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        DialogModule,
        InputTextModule,
        MultiSelectModule,
        TableModule,
    ],
    templateUrl: './admin-menu-items.component.html',
})
export class AdminMenuItemsComponent {
    private readonly clients = inject(RestaurantCatalogClients);
    private readonly menuItemsStore = inject(MenuItemsWithRelationsStore);
    private readonly tagsStore = inject(TagsStore);
    private readonly sizesStore = inject(SizesStore);

    readonly menuItems = this.menuItemsStore.resource;
    readonly allTags = this.tagsStore.resource;
    readonly allSizes = this.sizesStore.resource;

    // Dialog state
    readonly showDialog = signal(false);
    readonly editingItem = signal<IMenuItemWithRelations | null>(null);
    readonly saving = signal(false);
    readonly error = signal<string | null>(null);

    // Form fields
    readonly formName = signal('');
    readonly formDescription = signal('');
    readonly formImageUrl = signal('');
    readonly formPrice = signal<number | null>(null);
    readonly formIsFavorite = signal(false);
    readonly formIsActive = signal(false);
    readonly formTagIds = signal<string[]>([]);
    readonly formSizeIds = signal<string[]>([]);

    readonly tagOptions = computed<SelectOption[]>(() =>
        (this.allTags.value() ?? []).map((t) => ({
            label: t.name,
            value: t.id,
        })),
    );
    readonly sizeOptions = computed<SelectOption[]>(() =>
        (this.allSizes.value() ?? []).map((s) => ({
            label: s.name,
            value: s.id,
        })),
    );

    // ngModel bridges for PrimeNG MultiSelect (reads/writes signal via plain array)
    get selectedTagIds(): string[] {
        return this.formTagIds();
    }
    set selectedTagIds(value: string[]) {
        this.formTagIds.set(value);
    }

    get selectedSizeIds(): string[] {
        return this.formSizeIds();
    }
    set selectedSizeIds(value: string[]) {
        this.formSizeIds.set(value);
    }

    openCreate(): void {
        this.editingItem.set(null);
        this.formName.set('');
        this.formDescription.set('');
        this.formImageUrl.set('');
        this.formPrice.set(null);
        this.formIsFavorite.set(false);
        this.formIsActive.set(false);
        this.formTagIds.set([]);
        this.formSizeIds.set([]);
        this.error.set(null);
        this.showDialog.set(true);
    }

    openEdit(item: IMenuItemWithRelations): void {
        this.editingItem.set(item);
        this.formName.set(item.name);
        this.formDescription.set(item.description ?? '');
        this.formImageUrl.set(item.imageUrl ?? '');
        this.formPrice.set(item.price ?? null);
        this.formIsFavorite.set(item.isFavorite);
        this.formIsActive.set(item.isActive);
        this.formTagIds.set(item.tags.map((t) => t.id));
        this.formSizeIds.set(item.sizes.map((s) => s.id));
        this.error.set(null);
        this.showDialog.set(true);
    }

    closeDialog(): void {
        this.showDialog.set(false);
        this.editingItem.set(null);
    }

    async save(): Promise<void> {
        if (!this.formName().trim()) {
            this.error.set('Name is required.');
            return;
        }
        this.saving.set(true);
        this.error.set(null);
        try {
            const payload: INewMenuItem = {
                name: this.formName().trim(),
                description: this.formDescription().trim() || null,
                imageUrl: this.formImageUrl().trim() || null,
                price: this.formPrice(),
                isFavorite: this.formIsFavorite(),
                isActive: this.formIsActive(),
            };

            const editing = this.editingItem();
            const menuItemId = editing
                ? await this.updateItem(editing, payload)
                : await this.createItem(payload);

            await this.syncRelations(menuItemId);

            this.menuItemsStore.resource.reload();
            this.closeDialog();
        } catch (e) {
            this.error.set(e instanceof Error ? e.message : 'Save failed.');
        } finally {
            this.saving.set(false);
        }
    }

    async deleteItem(item: IMenuItemWithRelations): Promise<void> {
        if (!confirm(`Delete "${item.name}"?`)) return;
        try {
            await this.clients.menuItems.delete(item.id);
            this.menuItemsStore.resource.reload();
        } catch (e) {
            alert(e instanceof Error ? e.message : 'Delete failed.');
        }
    }

    private async createItem(payload: INewMenuItem): Promise<string> {
        const created = await this.clients.menuItems.createOne(payload);
        return created.id;
    }

    private async updateItem(
        existing: IMenuItemWithRelations,
        payload: INewMenuItem,
    ): Promise<string> {
        await this.clients.menuItems.update(existing.id, {
            ...existing,
            ...payload,
        });
        return existing.id;
    }

    joinNames(items: { name: string }[]): string {
        return items.length ? items.map((i) => i.name).join(', ') : '—';
    }

    private async syncRelations(menuItemId: string): Promise<void> {
        // Tags: delete all existing relations then recreate
        const allTagRels = await this.clients.menuItemToTag.findMany();
        const existingTagRels = allTagRels.filter(
            (r) => r.menuItemId === menuItemId,
        );
        for (const rel of existingTagRels) {
            await this.clients.menuItemToTag.delete(rel.id);
        }
        for (const tagId of this.formTagIds()) {
            await this.clients.menuItemToTag.createOne({ menuItemId, tagId });
        }

        // Sizes: delete all existing relations then recreate
        const allSizeRels = await this.clients.menuItemToSize.findMany();
        const existingSizeRels = allSizeRels.filter(
            (r) => r.menuItemId === menuItemId,
        );
        for (const rel of existingSizeRels) {
            await this.clients.menuItemToSize.delete(rel.id);
        }
        for (const sizeId of this.formSizeIds()) {
            await this.clients.menuItemToSize.createOne({
                menuItemId,
                sizeId,
            });
        }
    }
}
