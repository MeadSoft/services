import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
    RestaurantCatalogClients,
    SizesStore,
} from '../../../../../../../../packages/restaurant-catalog/http-client-angular/src';
import type { ISize } from '@meadsoft/restaurant-catalog-contracts';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'haru-admin-sizes',
    imports: [
        CommonModule,
        ButtonModule,
        DialogModule,
        InputTextModule,
        TableModule,
    ],
    templateUrl: './admin-sizes.component.html',
})
export class AdminSizesComponent {
    private readonly clients = inject(RestaurantCatalogClients);
    private readonly sizesStore = inject(SizesStore);

    readonly sizes = this.sizesStore.resource;

    readonly showDialog = signal(false);
    readonly editingSize = signal<ISize | null>(null);
    readonly saving = signal(false);
    readonly error = signal<string | null>(null);
    readonly formName = signal('');

    openCreate(): void {
        this.editingSize.set(null);
        this.formName.set('');
        this.error.set(null);
        this.showDialog.set(true);
    }

    openEdit(size: ISize): void {
        this.editingSize.set(size);
        this.formName.set(size.name);
        this.error.set(null);
        this.showDialog.set(true);
    }

    closeDialog(): void {
        this.showDialog.set(false);
        this.editingSize.set(null);
    }

    async save(): Promise<void> {
        if (!this.formName().trim()) {
            this.error.set('Name is required.');
            return;
        }
        this.saving.set(true);
        this.error.set(null);
        try {
            const editing = this.editingSize();
            if (editing) {
                await this.clients.sizes.update(editing.id, {
                    ...editing,
                    name: this.formName().trim(),
                });
            } else {
                await this.clients.sizes.createOne({
                    name: this.formName().trim(),
                });
            }
            this.sizesStore.resource.reload();
            this.closeDialog();
        } catch (e) {
            this.error.set(e instanceof Error ? e.message : 'Save failed.');
        } finally {
            this.saving.set(false);
        }
    }

    async deleteSize(size: ISize): Promise<void> {
        if (!confirm(`Delete size "${size.name}"?`)) return;
        try {
            await this.clients.sizes.delete(size.id);
            this.sizesStore.resource.reload();
        } catch (e) {
            alert(e instanceof Error ? e.message : 'Delete failed.');
        }
    }
}
