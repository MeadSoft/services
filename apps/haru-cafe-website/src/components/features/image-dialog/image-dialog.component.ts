import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

export interface IImageDialogData {
    src: string;
    alt: string;
}

@Component({
    selector: 'haru-image-dialog',
    templateUrl: './image-dialog.component.html',
    imports: [MatButtonModule, MatIconModule],
})
export class ImageDialogComponent {
    constructor(
        @Inject(DIALOG_DATA) protected data: IImageDialogData,
        protected dialog: MatDialogRef<ImageDialogComponent>,
    ) {}
}
