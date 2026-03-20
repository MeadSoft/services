import { EMPTY_LENGTH } from '@meadsoft/common-server';
import { Category } from './Categories';
import { IMenuItem } from './interfaces/IMenuItem';
import { Size } from './Size';

export class MenuItem implements IMenuItem {
    name: string;
    imageUrl?: string | undefined;
    description?: string | undefined;
    price: number;
    categories?: Category[] | undefined;
    isFavorite?: boolean | undefined;
    isActive?: boolean | undefined;
    size?: Size | undefined;

    constructor(menuItem: IMenuItem) {
        this.name = menuItem.name;
        this.imageUrl = menuItem.imageUrl;
        this.description = menuItem.description;
        this.price = menuItem.price;
        this.categories = menuItem.categories;
        this.isFavorite = menuItem.isFavorite;
        this.isActive = menuItem.isActive;
        this.size = menuItem.size;
    }

    hasDescription() {
        return (
            typeof this.description === 'string' &&
            this.description.length > EMPTY_LENGTH
        );
    }
}
