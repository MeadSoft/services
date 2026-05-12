import { Directive, ElementRef, input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
    IImageDialogData,
    ImageDialogComponent,
} from '@meadsoft/haru-cafe/components/features/image-dialog/image-dialog.component';

export interface IImageElementProvider extends HTMLElement {
    imageElement: HTMLImageElement | null;
}

export interface IImageLike {
    src: string;
    alt: string;
}

@Directive({
    selector: '[imageDialog]',
})
export class ImageDialogDirective {
    // @Input() imageDialog!: HTMLImageElement | string;
    imageDialog = input<HTMLImageElement | string>();
    private _image: IImageLike | null = null;
    get image() {
        return this._image;
    }
    eventTarget: HTMLElement | null = null;

    constructor(
        private elementRef: ElementRef<
            HTMLImageElement | IImageElementProvider
        >,
        private dialog: MatDialog,
    ) {}

    ngOnInit() {
        this.initialize(this.imageDialog());
    }

    initialize(image: string | IImageLike | null = null) {
        image = this.setImage(image);
        if (image === null) {
            return;
        }
        if (this._image instanceof HTMLElement) {
            this.eventTarget = this._image;
        } else {
            this.eventTarget = this.elementRef.nativeElement;
        }
        this.eventTarget.addEventListener('click', () => {
            this.openImageInDialog();
        });
        this.eventTarget.style.cursor = 'pointer';
    }

    openImageInDialog() {
        if (this._image === null) {
            console.error('ImageDialogDirective: No image element found.');
            return;
        }
        var data: IImageDialogData = {
            src: this._image.src,
            alt: this._image.alt,
        };
        this.dialog.open(ImageDialogComponent, {
            data: data,
            // maxWidth: "75%",
            // maxHeight: "75%",
            panelClass: 'bg-transparent',
        });
    }

    private setImage(image: string | IImageLike | null): IImageLike | null {
        var wasAnImageElementProvided =
            image !== null && image !== undefined && image !== '';
        if (wasAnImageElementProvided == false) {
            var isDirectiveOnAnImageElement =
                this.elementRef.nativeElement.tagName === 'IMG';
            if (isDirectiveOnAnImageElement == false) {
                this.imageElementError();
                return null;
            }
            this._image = this.elementRef.nativeElement as HTMLImageElement;
            return this._image;
        }
        if (typeof image === 'string') {
            this._image = {
                src: image,
                alt: 'Image',
            };
            return this._image;
        }
        this._image = image as HTMLImageElement;
        return this._image;
    }

    private imageElementError() {
        console.error('ImageDialogDirective: No image element found.');
    }
}
