import {Component, Input} from '@angular/core';

@Component({
    selector: 'asc-ac-dados-processo-card',
    templateUrl: './dados-processo-card.component.html',
    styleUrls: ['./dados-processo-card.component.scss']
})
export class DadosProcessoCardComponent {

    @Input()
    processo: any;

    observacao: string = '';

    goToTop() {
        window.scrollTo(0, 0);
    }

}
