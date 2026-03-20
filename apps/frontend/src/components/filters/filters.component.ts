import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
    MatButtonToggleChange,
    MatButtonToggleModule,
} from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { FilterService } from 'src/services/filter.service';
import { ITagNode } from 'src/data/category-nodes';
import {
    NOT_FOUND_INDEX,
    TagGraphService,
} from 'src/services/category-graph.service';
import { FIRST_INDEX } from '@meadsoft/common-browser';

@Component({
    selector: 'haru-filters',
    imports: [MatButtonToggleModule, MatChipsModule, CommonModule],
    templateUrl: './filters.component.html',
})
export class FiltersComponent {
    currentOptions: ITagNode[];

    constructor(
        protected filtersService: FilterService,
        protected tagGraphService: TagGraphService,
    ) {
        this.currentOptions = [this.tagGraphService.getRootNode()];
    }

    getStyle(categoryGroup: ITagNode) {
        return {
            'grid-template-columns': `repeat(${categoryGroup.childTagIds.length.toString()}, minmax(0, 1fr))`,
        };
    }

    onToggleButtonClicked(event: MatButtonToggleChange) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
        const tagId = event.source.value as string;
        let activeTags = this.filtersService.activeTags();
        const root = this.tagGraphService.getRootNode();
        const depth = this.tagGraphService.getDepthOfTag(root, tagId);
        if (depth === NOT_FOUND_INDEX) {
            console.error(`Tag ${tagId} not found in category graph`);
            return;
        }
        const isAlreadyActive = activeTags.includes(tagId);
        activeTags = activeTags.slice(FIRST_INDEX, depth);
        if (isAlreadyActive == false) {
            activeTags.push(tagId);
        }
        this.filtersService.activeTags.set(activeTags);
    }
}
