import {Component} from '@angular/core';

@Component({
    selector: 'asc-pagina-inicial',
    templateUrl: './pagina-inicial.component.html',
    styleUrls: ['./pagina-inicial.component.scss']
})
export class PaginaInicialComponent {

    index: number = -1;
    options: Array<string> = [
        "Beneficiário", "Finalidade", "Procedimento", "Profissional",
        "Documento Fiscal", "Documentos", "Resumo"
    ];

    setIndex(numero: number): void {
        this.index = numero;
    }

}
