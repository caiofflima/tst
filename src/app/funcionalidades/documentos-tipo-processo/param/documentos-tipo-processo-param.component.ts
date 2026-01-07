
import { Component,  OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { ComboService, DocumentoTipoProcessoService, MessageService, TipoDeficienciaService} from 'app/shared/services/services';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { DadoComboDTO } from 'app/shared/models/dtos';
import { take } from 'rxjs/operators';
import { Location } from '@angular/common';
import { DuvidasService } from 'app/shared/services/comum/duvidas.service';
@Component({
    selector: 'app-documentos-tipo-processo',
    templateUrl: './documentos-tipo-processo-param.component.html',
    styleUrls: ['./documentos-tipo-processo-param.component.scss']
})
export class DocumentosTipoProcessoParamComponent implements OnInit{

    sexos: SelectItem[];
    listComboEtadoCivil: DadoComboDTO[];
    listComboTipoProcesso: DadoComboDTO[];
    listComboTipoDocumento: DadoComboDTO[];
    listComboTipoBeneficiario: DadoComboDTO[];
    tipoDeficiencias: SelectItem[];

    /*
    formulario:any = this.formBuilder.group({
        tiposProcesso: [null, Validators.required],
        tiposBeneficiario: [null, Validators.required]
    });
    */

    formulario = this.formBuilder.group({
        'tiposProcesso': this.formBuilder.control(null),
        'tiposBeneficiario': this.formBuilder.control(null),
        'descricaoTiposProcesso': this.formBuilder.control(null),
        'descricaoTiposBeneficiario': this.formBuilder.control(null)
    });

    public inicializarCombos(): void {
        this.comboService.consultarComboTipoBeneficiario().pipe(
            take<DadoComboDTO[]>(1)
        ).subscribe(result => {this.listComboTipoBeneficiario = result.map(item => ({
                label: item.label,
                value: item.value,
                descricao: item.descricao
            }));
        });
        err => this.messageService.addMsgDanger(err.error);

        this.comboService.consultarComboTipoProcesso().pipe(
            take<DadoComboDTO[]>(1)
        ).subscribe(result => { this.listComboTipoProcesso = result.map(item => ({
                label: item.label,
                value: item.value,
                descricao: item.descricao
            }));
        });
        err => this.messageService.addMsgDanger(err.error);
    }

    compStyle = {};

    constructor(
        private readonly router: Router,
        private readonly location: Location,
        private readonly messageService: MessageService,
        private readonly formBuilder: FormBuilder,
        private readonly serviceTipoDeficiencia: TipoDeficienciaService,
        private readonly comboService: ComboService,
        public docTpProcService: DocumentoTipoProcessoService,
        public duvidasService: DuvidasService
    ) {
    }

    ngOnInit() {
        this.inicializarCombos();
    }

    public pesquisar(): void {

        const tiposProcesso =  this.formulario.controls['tiposProcesso'].value;
        const tiposBeneficiario = this.formulario.controls['tiposBeneficiario'].value;
        const descricaoTiposProcesso = this.listComboTipoProcesso.map(v => v.label).join(', ');
        const descricaoTiposBeneficiario = this.listComboTipoBeneficiario.map(v => v.label).join(', ');
        this.router.navigate(['/duvidas/documentos-tipo-pedido/buscar'], {
            queryParams: {
                tiposProcesso,
                tiposBeneficiario,
                descricaoTiposProcesso,
                descricaoTiposBeneficiario,
            }
        }).then();
    }

    public limparCampos(): void {
        this.formulario.reset();
        this.formulario.markAsPristine();
        this.formulario.markAsUntouched();
        this.formulario.updateValueAndValidity();
    }

    public retornaListaTipoDeficiencia() {
        this.serviceTipoDeficiencia.consultarTodos().subscribe(result => {
            this.tipoDeficiencias = result.map(item => ({
                label: item.descricao,
                value: item.id
            }));
        });
    }

    public voltar(): void {
        this.location.back();
    }
}
