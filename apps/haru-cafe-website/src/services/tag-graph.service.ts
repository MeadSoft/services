import { Injectable, signal } from '@angular/core';
import { TAG_GRAPH, ITagNode } from '@meadsoft/haru-cafe/data/tag-nodes';
import { FilterService } from './filter.service';

export const NOT_FOUND_INDEX = -1;

@Injectable({
    providedIn: 'root',
})
export class TagGraphService {
    tagGraph = signal<ITagNode[]>(TAG_GRAPH);

    constructor(protected filtersService: FilterService) {}

    getRootNode(): ITagNode {
        const node = this.tagGraph().find((node_) => node_.tagId === null);
        if (node === undefined) {
            console.error(`Root node not found in tag graph`);
            throw new Error(`Root node not found in tag graph`);
        }
        return node;
    }

    getNodes(): ITagNode[] {
        const activeTags = this.filtersService.activeTags();
        const root = this.getRootNode();
        const nodes: ITagNode[] = [root];
        for (const tag of activeTags) {
            const currentNode = this.tagGraph().find(
                (node) => node.tagId === tag.name,
            );
            if (currentNode === undefined) {
                return nodes;
            }
            nodes.push(currentNode);
        }
        return nodes;
    }

    findNodeWithTag(tagId: string): ITagNode | undefined {
        return this.tagGraph().find((node) => node.tagId === tagId);
    }

    getDepthOfTag(
        root: ITagNode,
        target: string,
        depth = NOT_FOUND_INDEX,
    ): number {
        if (root.tagId === target) {
            return depth;
        }
        for (const childTag of root.childTagIds) {
            if (childTag === target) {
                // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                return depth + 1;
            }
            const nextNode = this.findNodeWithTag(childTag);
            if (nextNode === undefined) {
                continue;
            }
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            const newDepth = this.getDepthOfTag(nextNode, target, depth + 1);
            if (newDepth !== NOT_FOUND_INDEX) {
                return newDepth;
            }
        }
        return NOT_FOUND_INDEX;
    }

    isTagSelected(tagId: string) {
        return this.filtersService
            .activeTags()
            .some((tag) => tag.name === tagId);
    }
}
