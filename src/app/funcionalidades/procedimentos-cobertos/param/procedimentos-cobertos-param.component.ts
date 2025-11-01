
import { Component,  OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ComboService, MessageService} from 'app/shared/services/services';
import { Router } from '@angular/router';
import { DadoComboDTO } from 'app/shared/models/dtos';
import { take } from 'rxjs/operators';
import { Location } from '@angular/common';
import { BaseComponent } from 'app/shared/components/base.component';
@Component({
    selector: 'app-procedimentos-cobertos',
    templateUrl: './procedimentos-cobertos-param.component.html',
    styleUrls: ['./procedimentos-cobertos-param.component.scss']
})
export class ProcedimentosCobertosParamComponent implements OnInit{
    listComboTipoProcesso: DadoComboDTO[]; 

    formulario = this.formBuilder.group({
        tiposProcesso: [null, Validators.required],
    });

    get compStyle(): any {
        return {};
    }

    public inicializarCombos(): void {
        this.comboService.consultarComboTipoProcesso().pipe(
            take<DadoComboDTO[]>(1)
        ).subscribe(res => this.listComboTipoProcesso = res, err => this.messageService.addMsgDanger(err.error));
    }

    constructor(
        private readonly router: Router,
        private readonly location: Location,
        private readonly messageService: MessageService,
        private readonly formBuilder: FormBuilder,
        private readonly comboService: ComboService,
    ) {
    }

    ngOnInit() {
       
        this.inicializarCombos();
    }

    public pesquisar(): void {
        const tiposProcesso = this.formulario.get('tiposProcesso').value ? this.formulario.get('tiposProcesso').value : null;
        const descricaoTiposProcesso = this.formulario.get('tiposProcesso').value ? this.listComboTipoProcesso.filter( p => p.value = this.formulario.get('tiposProcesso').value)[0].label : null;
        console.log(descricaoTiposProcesso)
        this.router.navigate(['/duvidas/consultar-procedimentos-cobertos/buscar'], {
            queryParams: {
                tiposProcesso,
                descricaoTiposProcesso,
            }
        }).then();
    }

    public limparCampos(): void {
        this.formulario.reset();
        this.formulario.markAsPristine();
        this.formulario.markAsUntouched();
        this.formulario.updateValueAndValidity();
    }

    public voltar(): void {
        this.location.back();
    }

}
