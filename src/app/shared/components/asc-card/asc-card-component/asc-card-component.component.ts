import {Component, Input} from '@angular/core';

@Component({
    selector: 'asc-card-component',
    templateUrl: './asc-card-component.component.html',
    styleUrls: ['./asc-card-component.component.scss']
})
export class AscCardComponentComponent {

    @Input()
    hasAfterContent: boolean;

    @Input()
    noSpacing: boolean;
}
