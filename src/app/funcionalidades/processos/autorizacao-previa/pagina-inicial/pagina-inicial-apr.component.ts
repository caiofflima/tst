import {Component} from '@angular/core';

@Component({
    selector: 'app-pagina-incial',
    templateUrl: './pagina-inicial-apr.component.html',
    styleUrls: ['./pagina-inicial-apr.component.scss']
})
export class PaginaInicialAprComponent {
    index: number = -1;
    options: Array<string> = [
        "Beneficiário", "Finalidade", "Procedimento", "Profissional", "Documentos", "Resumo"
    ];

    setIndex(numero: number): void {
        this.index = numero;
    }
}
