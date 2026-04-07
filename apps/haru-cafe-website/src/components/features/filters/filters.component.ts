import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
    SelectButtonChangeEvent,
    SelectButtonModule,
} from 'primeng/selectbutton';
import { FIRST_INDEX } from '@meadsoft/common-browser';
import { FilterService } from 'src/services/filter.service';
import { ITagNode } from 'src/data/tag-nodes';
import { TagGraphService } from 'src/services/tag-graph.service';
import { TagsStore } from '@meadsoft/restaurant-catalog-client-angular';

@Component({
    selector: 'haru-filters',
    imports: [CommonModule, SelectButtonModule],
    templateUrl: './filters.component.html',
})
export class FiltersComponent {
    currentOptions: ITagNode[];

    constructor(
        protected filtersService: FilterService,
        protected tagGraphService: TagGraphService,
        protected tagsStore: TagsStore,
    ) {
        this.currentOptions = [this.tagGraphService.getRootNode()];
    }

    getStyle(categoryGroup: ITagNode) {
        return {
            'grid-template-columns': `repeat(${categoryGroup.childTagIds.length.toString()}, minmax(0, 1fr))`,
        };
    }

    onToggleButtonClicked(event: SelectButtonChangeEvent, depth: number) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
        const tagName = event.value as string | null;
        let activeTags = this.filtersService.activeTags();
        if (tagName === null) {
            activeTags = activeTags.slice(FIRST_INDEX, depth);
            this.filtersService.activeTags.set(activeTags);
            return;
        }
        const isAlreadyActive = activeTags.some(
            (tag_) => tag_.name === tagName,
        );
        activeTags = activeTags.slice(FIRST_INDEX, depth);
        if (isAlreadyActive == false) {
            const tag = this.tagsStore.resource
                .value()
                .find((tag_) => tag_.name === tagName);
            if (tag === undefined) {
                console.error(`Tag with name ${tagName} not found in database`);
                return;
            }
            activeTags.push(tag);
        }
        this.filtersService.activeTags.set(activeTags);
    }
}
