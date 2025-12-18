import {ChangeDetectorRef, Component} from '@angular/core';
import {BaseComponent} from "../../../shared/components/base.component";
import {MessageService} from "../../../shared/components/messages/message.service";
import {PrazoTratamentoService} from "../../../shared/services/comum/prazo-tratamento.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PrazoTratamento} from "../../../shared/models/comum/prazo-tratamento";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SelectItem} from "primeng/api";
import {SituacaoProcessoService} from "../../../shared/services/comum/situacao-processo.service";
import {DadoComboDTO} from "../../../shared/models/dto/dado-combo";
import {take} from "rxjs/operators";
import {TipoBeneficiarioService} from "../../../shared/services/comum/tipo-beneficiario.service";
import {Location} from "@angular/common";
import {SituacaoProcesso} from "../../../shared/models/comum/situacao-processo";
import {Util} from "../../../arquitetura/shared/util/util";

import { CheckboxChangeEvent } from 'primeng/checkbox';
@Component({
    selector: 'asc-parametrizacao-prazos-form',
    templateUrl: './parametrizacao-prazos-form.component.html',
    styleUrls: ['./parametrizacao-prazos-form.component.scss']
})
export class ParametrizacaoPrazosFormComponent extends BaseComponent {

    id: number;
    prazoTratamento = new PrazoTratamento();
    listComboTipoBeneficiario: DadoComboDTO[];
    restauraPrazoTratamento: PrazoTratamento;
    itensSituacoesProcesso: SelectItem[] = [];
    itensTipoBeneficiario: SelectItem[] = [];
    requiredMsg: string = null;

    idSituacaoProcesso = this.formBuilder.control(null);
    idTipoProcesso = this.formBuilder.control(null);
    tiposBeneficiario = this.formBuilder.control(null, [Validators.required]);
    prazo = this.formBuilder.control(null);
    diaUtil = this.formBuilder.control(null);
    idMudancaAutomatica = this.formBuilder.control(null);
    historicoAutomatico = this.formBuilder.control(null);
    dataInativacao = this.formBuilder.control(null);
    inativo = this.formBuilder.control(false);

    formulario: FormGroup = this.formBuilder.group({
        id: this.formBuilder.control(null),
        idSituacaoProcesso: this.idSituacaoProcesso,
        idTipoProcesso: this.idTipoProcesso,
        //tiposBeneficiario: [null, Validators.required],
        prazo: this.prazo,
        diaUtil: this.diaUtil,
        idMudancaAutomatica: this.idMudancaAutomatica,
        historicoAutomatico: this.historicoAutomatico,
        dataInativacao: this.dataInativacao,
        inativo: this.inativo
    })

    ngOnInit() {
        this.changeDetectorRef.detectChanges();
    }

    constructor(
        private readonly router: Router,
        private readonly location: Location,
        private readonly route: ActivatedRoute,
        private readonly formBuilder: FormBuilder,
        private readonly prazoTratamentoService: PrazoTratamentoService,
        private readonly tipoBeneficiarioService: TipoBeneficiarioService,
        private readonly situacaoProcessoService: SituacaoProcessoService,
        override readonly messageService: MessageService,
        private readonly changeDetectorRef: ChangeDetectorRef
    ) {
        super(messageService);
        this.id = this.route.snapshot.params['id'];
        this.carregarSituacaoProcesso();
        this.consultarEstadoInicialPrazoTratamento();
        this.requiredMsg = this.bundle("MA005");
    }

    private consultarEstadoInicialPrazoTratamento(): void {
        if (this.id) {
            this.prazoTratamentoService.get(this.id).pipe(
                take<PrazoTratamento>(1)
            ).subscribe(prazoTratamento => {
                this.prazoTratamento = prazoTratamento;
                this.restauraPrazoTratamento = prazoTratamento;

                for (let key in this.prazoTratamento) {
                    if (this.formulario.get(key)) {
                        this.formulario.get(key).setValue(this.prazoTratamento[key]);
                    }
                }
                this.tiposBeneficiario.setValue(this.prazoTratamento.tiposBeneficiario.map(x => Number(x)));
                this.dataInativacao.setValue(Util.getDate(prazoTratamento.dataInativacao));
                this.diaUtil.setValue(this.prazoTratamento.diaUtil === 'SIM');
                this.inativo.setValue(this.prazoTratamento.inativo === 'SIM');
                this.carregarSituacaoProcesso();
                this.consultarTiposBeneficiario();
            });
        } else {
            this.consultarTiposBeneficiario();
        }
    }

    private consultarTiposBeneficiario(): void {
        this.tipoBeneficiarioService.consultarTodosBeneficiarios().pipe(
            take<DadoComboDTO[]>(1)
        ).subscribe(res => {
            this.listComboTipoBeneficiario = res;
        }, err => this.messageService.addMsgDanger(err.error));
    }

    get hintBeneficiarios(): string {
        const padrao = 'Nenhum item selecionado.';
        if (this.listComboTipoBeneficiario && this.tiposBeneficiario.value) {
            const valores = this.listComboTipoBeneficiario.filter(x => this.tiposBeneficiario.value.includes(x));
            return valores.map(x => x.label).join('<br/>') || padrao;
        }

        return padrao;
    }

    get listComboTipoBeneficiarioSelecionados(): DadoComboDTO[] {
        if(this.listComboTipoBeneficiario && this.tiposBeneficiario.value){
            const valores = this.listComboTipoBeneficiario.filter(x => Number(x.value) === Number(this.tiposBeneficiario.value));
 
            return valores || [];
        }
        return [];
    }

    public limparCampos(): void {
        this.formulario.reset();
        this.formulario.markAsPristine();
        this.formulario.markAsUntouched();
        this.formulario.updateValueAndValidity();
        this.tiposBeneficiario.reset();
    }

    public updateValue(value): void {
        this.idMudancaAutomatica.setValue(value);
        this.idMudancaAutomatica.markAsDirty({onlySelf:true});
        this.idMudancaAutomatica.markAsTouched({onlySelf:true});
    }

    public restaurarCampos(): void {
        this.consultarEstadoInicialPrazoTratamento();
    }

    public excluir(): void {
        this.messageService.addConfirmYesNo(this.bundle("MA021"), () => {
            this.prazoTratamentoService.delete(this.id).subscribe(async () => {
                this.showSuccessMsg(this.bundle("MA039"));
                await this.router.navigate(['/manutencao/parametros/prazos-status/buscar']);
            }, err => this.showDangerMsg(err.error));
        });
    }

    public voltar(): void {
        this.location.back();
    }

    validarFormulario():boolean{
        return this.validarCamposFormulario();
    }

    validarCamposFormulario(): boolean {
        if(this.idSituacaoProcesso.value 
            && this.idTipoProcesso.value 
            && this.prazo.value 
            && this.tiposBeneficiario.value){
                return true;
        }
        return false;
    }

    public salvar(): void {
        let prazoTratamento: PrazoTratamento = {
            id: this.id,
            idSituacaoProcesso: this.idSituacaoProcesso.value,
            idTipoProcesso: this.idTipoProcesso.value,
            prazo: this.prazo.value,
            diaUtil: this.diaUtil.value ? 'SIM' : 'NAO',
            idMudancaAutomatica: this.idMudancaAutomatica.value,
            historicoAutomatico: this.historicoAutomatico.value,
            tiposBeneficiario: this.tiposBeneficiario.value,
            inativo: this.inativo.value ? 'SIM' : 'NAO',
            dataInativacao: this.dataInativacao.value,
        };

        if (this.id) {
            this.prazoTratamentoService.put(prazoTratamento).pipe(take(1)).subscribe(() => {
                this.showSuccessMsg(this.bundle("MA022"));
                this.location.go("/manutencao/parametros/prazos-status/buscar", 'id=' + this.id);

                this.router.navigate(["/manutencao/parametros/prazos-status/buscar"], {
                    queryParams: {
                        id: this.id
                    }
                });
            }, err => this.showDangerMsg(err.error));
        } else {
            this.prazoTratamentoService.post(prazoTratamento).pipe(take<PrazoTratamento>(1)
            ).subscribe(pt => {
                this.showSuccessMsg(this.bundle("MA038"));
                this.router.navigate(['/manutencao/parametros/prazos-status/buscar'], {
                    queryParams: {
                        id: pt.id
                    }
                });
            }, err => this.showDangerMsg(err.error));
        }
    }

    public carregarSituacaoProcesso(): void {
        this.itensSituacoesProcesso = [];
        this.situacaoProcessoService.consultarTodasTransicoesManuais().pipe(
            take<SituacaoProcesso[]>(1)
        ).subscribe(res => {
            this.itensSituacoesProcesso = res.map(x => ({label: x.nome, value: x.id}) as SelectItem)
        }, err => this.showDangerMsg(err.error));
    }

    public onChangeDiaUtil() {
        if (this.diaUtil) {
            this.diaUtil.setValue('diaUtil')
        } else {
            this.diaUtil.reset();
        }
    }

    public onChangeInativo(event: CheckboxChangeEvent) {
        if (event) {
            if(!this.dataInativacao.value){
                this.dataInativacao.setValue(new Date())
                this.dataInativacao.setValidators(Validators.required);
            }
        } else {
            this.dataInativacao.clearValidators();
            this.dataInativacao.setValue(null);
            this.dataInativacao.markAsPristine();
            this.dataInativacao.markAsUntouched();
            this.dataInativacao.updateValueAndValidity();
        }
    }
}
