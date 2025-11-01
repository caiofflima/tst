import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {SelectItem} from "primeng/api";
import {AscValidators} from "../../../shared/validators/asc-validators";
import {BaseComponent} from "../../../shared/components/base.component";
import {MessageService} from "../../../shared/components/messages/message.service";
import {Location} from "@angular/common";
import {Util} from "../../../arquitetura/shared/util/util";
import { MotivoNegacao, SituacaoProcesso } from 'app/shared/models/entidades';
import { ComboService, MotivoNegacaoService } from 'app/shared/services/services';
import { take } from 'rxjs';

@Component({
    selector: 'asc-parametrizacao-motivo-negacao-form',
    templateUrl: './parametrizacao-motivo-negacao-form.component.html',
    styleUrls: ['./parametrizacao-motivo-negacao-form.component.scss']
})
export class ParametrizacaoMotivoNegacaoFormComponent extends BaseComponent {

    id: number;
    motivoNegacao: MotivoNegacao = new MotivoNegacao();
    situacaoPedidos: SelectItem[];
    situacaoPedido: SituacaoProcesso;

    tituloNegacao = this.formBuilder.control(null, [Validators.maxLength(450)]);
    descricaoHistoricoNegacao = this.formBuilder.control(null, [Validators.maxLength(4000)]);
    inativo = this.formBuilder.control(false);
    dataInativacao = this.formBuilder.control(null, AscValidators.dataIgualAtualMaior);
    dataCadastramento = this.formBuilder.control(null);
    codigoUsuarioCadastramento = this.formBuilder.control(null);
    idSituacaoPedidoCombo = this.formBuilder.control(null, Validators.required);
    icNiveisNegacaoCombo = this.formBuilder.control(null);
    idSituacaoPedido: number;
    nivelNegacao: string = null;
    isShowComboSituacao: boolean = true;

    icNiveisNegacao: SelectItem[] = [{
        value: "S",
        label: "PEDIDO"
    }, {
        value: "D",
        label: "PROCEDIMENTO"
    }];

    formulario: FormGroup = this.formBuilder.group({
        idSituacaoProcesso: this.idSituacaoPedidoCombo,
        titulo: this.tituloNegacao,
        descricaoHistorico: this.descricaoHistoricoNegacao,
        inativo: this.inativo,
        dataInativacao: this.dataInativacao,
        dataCadastramento: this.dataCadastramento,
        codigoUsuarioCadastramento: this.codigoUsuarioCadastramento,
        id: this.formBuilder.control(null),
        nivelNegacao: this.icNiveisNegacaoCombo
    });

    constructor(
        protected override messageService: MessageService,
        private activatedRoute: ActivatedRoute,
        private comboService: ComboService,
        private motivoNegacaoService: MotivoNegacaoService,
        private formBuilder: FormBuilder,
        private router: Router,
        private location: Location
    ) {
        super(messageService);
        this.getTiposPedidos();
        this.id = this.activatedRoute.snapshot.params['id'];
        this.consultarEstadoInicialMotivoNegacao();
    }

    private consultarEstadoInicialMotivoNegacao(): void{
        if (this.id) {
            this.motivoNegacaoService.get(this.activatedRoute.snapshot.params["id"]).pipe(take(1)).subscribe(
                (motivoDeNegacao: MotivoNegacao) => {
                this.motivoNegacao = motivoDeNegacao;
                this.motivoNegacao.dataInativacao = Util.getDate(motivoDeNegacao.dataInativacao);
                      
                for (let key in this.motivoNegacao) {
                    if (this.formulario.get(key) != undefined) {
                        this.formulario.get(key).setValue(this.motivoNegacao[key]);
                    }
                }
                this.nivelNegacaoSelecionado(this.motivoNegacao.nivelNegacao);
                this.getTiposPedidos();
            });
        }
    }

    limparCampos() {
        this.formulario.reset();
        this.formulario.markAsPristine();
        this.formulario.markAsUntouched();
        this.formulario.updateValueAndValidity();
    }

    getTiposPedidos(): void {
        this.comboService.consultarComboSituacaoProcesso().subscribe(result => {
            this.situacaoPedidos = result.map(item => ({
                label: item.label,
                value: item.value,
            }))
        });
    }

    public restaurarCampos(): void {
        this.consultarEstadoInicialMotivoNegacao();
    }

    nivelNegacaoSelecionado(nivel: any) {
        this.nivelNegacao = nivel;
        if (this.nivelNegacao === "D") {
            this.isShowComboSituacao = false;
            this.idSituacaoPedidoCombo.clearValidators();
            this.idSituacaoPedidoCombo.setValue(null);
            this.idSituacaoPedidoCombo.markAsPristine();
            this.idSituacaoPedidoCombo.markAsUntouched();
        } else {
            this.isShowComboSituacao = true;
            this.idSituacaoPedidoCombo.updateValueAndValidity();
        }
     }

    public salvar(): void {
        let motivoNegacao = this.formulario.value;
        if (!this.motivoNegacao.id) {
            this.motivoNegacaoService.post(motivoNegacao).subscribe(async res => {
                this.motivoNegacao = res;
                this.showSuccessMsg(this.bundle("MA038"));
                await this.router.navigate(['manutencao/parametros/motivo-negacao/buscar'],{
                    queryParams:{
                        id: res.id,
                        tituloNegacao: this.tituloNegacao.value
                    }
                });
                }, err => this.showDangerMsg(err.error));
            } else {
                this.motivoNegacaoService.put(motivoNegacao).subscribe(async () => {
                    this.showSuccessMsg(this.bundle("MA022"));
                    await this.router.navigate(['manutencao/parametros/motivo-negacao/buscar'],{
                        queryParams:{
                            id: this.id,
                            tituloNegacao: this.tituloNegacao.value
                    }
                });
            }, err => this.showDangerMsg(err.error));
        }
    }

    public excluir() {
        this.messageService.addConfirmYesNo(this.bundle("MA021"), () => {
            this.motivoNegacaoService.delete(this.id).subscribe(async () => {
                    this.showSuccessMsg(this.bundle("MA039"));
                    await this.router.navigate(['manutencao/parametros/motivo-negacao/buscar']);
                }, err => this.showDangerMsg(err.error)
            );
        });
    }

    public onChangeInativo(inativo: boolean) {
        if (inativo) {
            this.dataInativacao.setValue(new Date())
        } else {
            this.dataInativacao.clearValidators();
            this.dataInativacao.setValue(null);
            this.dataInativacao.markAsPristine();
            this.dataInativacao.markAsUntouched();
            this.dataInativacao.updateValueAndValidity();
        }
    }

    voltar(): void {
        this.location.back();
    }
}
