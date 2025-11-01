import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'asc-finalidade',
    templateUrl: './finalidade.component.html',
    styleUrls: ['./finalidade.component.scss']
})

export class FinalidadeComponent {

    readonly formularioFinalidade = new FormGroup({
        tipoProcesso: new FormControl(null, Validators.required),
        finalidade: new FormControl(null, Validators.required),
    });

    matricula: any;
}
