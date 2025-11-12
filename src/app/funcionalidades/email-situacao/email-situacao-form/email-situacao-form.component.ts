import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {BaseComponent} from 'app/shared/components/base.component';
import {ActivatedRoute, Router} from '@angular/router';
import {MessageService} from 'app/shared/components/messages/message.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ComboService} from 'app/shared/services/comum/combo.service';
import {DadoComboDTO} from 'app/shared/models/dto/dado-combo';
import {take} from "rxjs/operators";
import {Location} from "@angular/common";
import {EmailService} from "../../../shared/services/comum/email.service";
import {Email} from "../../../shared/models/comum/email";
import {TipoBeneficiarioService} from "../../../shared/services/comum/tipo-beneficiario.service";
import {SituacaoProcessoService} from "../../../shared/services/comum/situacao-processo.service";
import {TipoProcessoService} from "../../../shared/services/comum/tipo-processo.service";
import {TipoProcesso} from "../../../shared/models/comum/tipo-processo";
import {AscValidators} from "../../../shared/validators/asc-validators";
import {Util} from "../../../arquitetura/shared/util/util";
import { SituacaoProcesso } from 'app/shared/models/entidades';

import { CheckboxChangeEvent } from 'primeng/checkbox';
@Component({
    selector: 'app-email-situacao-novo',
    templateUrl: './email-situacao-form.component.html'
})
export class EmailSituacaoFormComponent extends BaseComponent implements OnInit {

    id: number;
    email = new Email();

    valorObservacaoFicticio: number = 1000;
    valorIdObservacao: number = 2;
       
    listComboTipoDestinatario: DadoComboDTO[];
    listComboSituacaoProcesso: DadoComboDTO[];
    listComboTipoProcesso: DadoComboDTO[];
    listComboTipoBeneficiario: DadoComboDTO[];

    idSituacaoProcesso = this.formBuilder.control(null);
    idTipoOcorrencia = this.formBuilder.control(null);
    tiposProcesso = this.formBuilder.control(null)
    tiposBeneficiario = this.formBuilder.control(null)
    tiposDestinatario = this.formBuilder.control(null)
    nomeRemetente = this.formBuilder.control(null)
    emailRemetente = this.formBuilder.control(null)
    copiaPara = this.formBuilder.control(null)
    assunto = this.formBuilder.control(null)
    texto = this.formBuilder.control(null)
    inativo = this.formBuilder.control(false);
    dataInativacao = this.formBuilder.control(null, AscValidators.dataIgualAtualMaior);

    formulario: FormGroup = this.formBuilder.group({
        idSituacaoProcesso: this.idSituacaoProcesso,
        idTipoOcorrencia: this.idTipoOcorrencia,
        tiposProcesso: this.tiposProcesso,
        tiposBeneficiario: this.tiposBeneficiario,
        tiposDestinatario: this.tiposDestinatario,
        nomeRemetente: this.nomeRemetente,
        emailRemetente: this.emailRemetente,
        copiaPara: this.copiaPara,
        assunto: this.assunto,
        texto: this.texto,
        inativo: this.inativo,
        dataInativacao: this.dataInativacao,
    })

    constructor(
        override readonly messageService: MessageService,
        private readonly formBuilder: FormBuilder,
        private readonly comboService: ComboService,
        private readonly tipoProcessoService: TipoProcessoService,
        private readonly emailService: EmailService,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly location: Location,
        private readonly changeDetectorRef: ChangeDetectorRef
    ) {
        super(messageService);
        this.id = Number(this.route.snapshot.params['id']);
    }

    ngOnInit() {
        this.consultarEstadoInicialEmail()
        this.changeDetectorRef.detectChanges()
    }

    get listComboTipoBeneficiarioSelecionado(): DadoComboDTO[] {
        return this.tiposBeneficiario.value || [];
    }

    private consultarEstadoInicialEmail(): void {
        if (this.id) {
            this.emailService.get(this.id).pipe(
                take<Email>(1)
            ).subscribe(email => {
                this.setarValoresNoFormulario(email);
                this.changeDetectorRef.detectChanges();
                this.setarOcorrenciaObservacao();
                this.consultarDestinatarios();
                this.consultarTiposProcesso();
                this.comboService.consultarComboTipoBeneficiarioPorTipoProcesso(email.tiposProcesso).pipe(
                    take<DadoComboDTO[]>(1)
                ).subscribe(res => {
                    this.listComboTipoBeneficiario = res;
                    if (this.email.tiposProcesso) {
                        this.tiposBeneficiario.setValue(this.email.tiposBeneficiario.map(tipo => res.find(x => x.value == tipo)));
                    }
                    this.changeDetectorRef.detectChanges();
                }, err => this.showDangerMsg(err.error));
            });
        } else {
            this.consultarDestinatarios();
            this.consultarTiposProcesso();
        }
    }

    private setarValoresNoFormulario(email: Email): void {
        this.email = email;
        this.email.dataInativacao = Util.getDate(email.dataInativacao);
        for (let key in this.email) {
            if (this.formulario.get(key) != undefined) {
                this.formulario.get(key).setValue(this.email[key]);
            }
        }
    }

    private setarOcorrenciaObservacao(): void {
        if (this.email.idTipoOcorrencia !== null) {
            this.formulario.get("idSituacaoProcesso").setValue(this.valorObservacaoFicticio);
        }
    }

    private consultarTiposProcesso(): void {
        this.tipoProcessoService.consultarTodos().pipe(
            take<TipoProcesso[]>(1)
        ).subscribe(res => {
            this.listComboTipoProcesso = res.map(x => ({
                value: x.id,
                label: x.nome
            } as DadoComboDTO));
            if (this.email.tiposProcesso) {
                this.tiposProcesso.setValue(this.email.tiposProcesso.map(tipo => this.listComboTipoProcesso.find(x => x.value == tipo)));
            }

            this.changeDetectorRef.detectChanges();
        }, err => this.showDangerMsg(err.error));
    }

    private consultarDestinatarios(): void {
        this.comboService.consultarTipoDestinatario().pipe(
            take<DadoComboDTO[]>(1)
        ).subscribe(res => {
            this.listComboTipoDestinatario = res;
            if (this.email.tiposDestinatario) {
                this.tiposDestinatario.setValue(this.email.tiposDestinatario.map(tipo => res.find(x => x.value == tipo)));
            }

            this.changeDetectorRef.detectChanges();
        }, err => this.showDangerMsg(err.error));
    }

    onChangeTipoProcesso(): void {
        let tiposProcesso: DadoComboDTO[] = this.formulario.controls['tiposProcesso'].value;
        this.listComboTipoBeneficiario = [];
        if (tiposProcesso && tiposProcesso.length > 0) {
            this.comboService.consultarComboTipoBeneficiarioPorTipoProcesso(tiposProcesso.map(x => x.value)).pipe(
                take<DadoComboDTO[]>(1)
            ).subscribe(res => this.listComboTipoBeneficiario = res, err => this.showDangerMsg(err.error));
        }
    }

    voltar() {
        this.location.back();
    }

    salvar(): void {
        let email: Email = this.formulario.value;
        email.id = this.id;
        email.tiposBeneficiario = this.tiposBeneficiario.value.map(x => x.value);
        email.tiposProcesso = this.tiposProcesso.value.map(x => x.value);
        email.tiposDestinatario = this.tiposDestinatario.value.map(x => x.value);

        if (email.idSituacaoProcesso === this.valorObservacaoFicticio) {
            email.idSituacaoProcesso = null;
            email.idTipoOcorrencia = this.valorIdObservacao;
        }

        if (this.id) {
            this.emailService.put(email).pipe(
                take<Email>(1)
            ).subscribe(e => {
                this.showSuccessMsg(this.bundle("MA022"));

                this.router.navigate(['/manutencao/parametros/email/buscar'], {
                    queryParams: {
                        id: e.id
                    }
                });
            }, err => this.showDangerMsg(err.error));
        } else {
            this.emailService.post(email).pipe(
                take<Email>(1)
            ).subscribe(e => {
                this.showSuccessMsg(this.bundle("MA038"));

                this.router.navigate(['/manutencao/parametros/email/buscar'], {
                    queryParams: {
                        id: e.id
                    }
                });
            }, err => this.showDangerMsg(err.error));
        }
    }

    public limparCampos(): void {
        this.formulario.reset();
        this.formulario.markAsPristine();
        this.formulario.markAsUntouched();
        this.formulario.updateValueAndValidity();
    }

    public excluir() {
        this.messageService.addConfirmYesNo(this.bundle("MA021"), () => {
            this.emailService.delete(this.id).pipe(take(1)).subscribe(async () => {
                    this.showSuccessMsg(this.bundle("MA039"));
                    await this.router.navigate(['manutencao/parametros/email/buscar']);
                }, err => this.showDangerMsg(err.error)
            );
        });
    }

    public restaurarCampos(): void {
        this.consultarEstadoInicialEmail();
    }

    public isNaNOrNull(id: any): boolean {
        return isNaN(id) || (id===null);
    }

    public onChangeInativo(event: CheckboxChangeEvent) {
        if (event.checked) {
            this.dataInativacao.setValue(new Date())
        } else {
            this.dataInativacao.reset();
        }
    }

    public converterParaBoolean(valor: string): boolean {
        return valor === 'SIM';
    }
}
