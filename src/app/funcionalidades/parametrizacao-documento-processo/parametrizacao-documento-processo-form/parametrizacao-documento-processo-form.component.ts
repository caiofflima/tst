import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SelectItem} from "primeng/api";
import {TipoDeficienciaService} from "../../../shared/services/comum/tipo-deficiencia.service";
import {DocumentoService} from "../../../shared/services/comum/documento.service";
import {CaraterSolicitacaoService} from "../../../shared/services/comum/carater-solicitacao.service";
import {GrupoDocumentoService} from "../../../shared/services/comum/grupo-documento.service";
import {DocumentoTipoProcessoService} from "../../../shared/services/comum/documento-tipo-processo.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MessageService} from "../../../shared/components/messages/message.service";
import {BaseComponent} from "../../../shared/components/base.component";
import {AscValidators} from "../../../shared/validators/asc-validators";
import {Util} from "../../../arquitetura/shared/util/util";
import {DocumentoTipoProcesso} from "../../../shared/models/dto/documento-tipo-processo";
import {Documento} from "../../../shared/models/comum/documento";
import {TipoBeneficiarioService} from "../../../shared/services/comum/tipo-beneficiario.service";
import {Location} from "@angular/common";
import {DadoComboDTO} from "../../../shared/models/dto/dado-combo";
import {ComboService} from "../../../shared/services/comum/combo.service";
import {take} from "rxjs/operators";
import {NumberUtil} from "../../../shared/util/number-util";

@Component({
    selector: 'asc-parametrizacao-documento-processo-form',
    templateUrl: './parametrizacao-documento-processo-form.component.html',
    styleUrls: ['./parametrizacao-documento-processo-form.component.scss']
})
export class ParametrizacaoDocumentoProcessoFormComponent extends BaseComponent {

    sexos: SelectItem[] = [{
        label: 'Selecione uma opção',
        value: null
    }, {
        label: 'Masculino',
        value: 'M'
    }, {
        label: 'Feminino',
        value: 'F'
    }];

    id: number;
    idTipoProcesso: number;
    itensDocumento: SelectItem[];
    grupoDocumento: SelectItem[];
    tipoDeficiencias: SelectItem[];
    caraterSolicitacao: SelectItem[];
    listComboTipoBeneficiario: SelectItem[];
    listComboTipoBeneficiarioSelecionados: SelectItem[];
    documentoTipoProcesso = new DocumentoTipoProcesso();

    idEstadoCivil = this.formBuilder.control(null);
    idTipoDeficiencia = this.formBuilder.control(null);
    idMotivoSolicitacao = this.formBuilder.control(null);
    idCaraterSolicitacao = this.formBuilder.control(null);
    idDocumento = this.formBuilder.control(null, [Validators.required]);
    tiposProcesso = this.formBuilder.control(null, [Validators.required]);
    tiposBeneficiario = this.formBuilder.control(null, [Validators.required]);

    sexo = this.formBuilder.control(null);
    inativo = this.formBuilder.control(false);
    idadeMinima = this.formBuilder.control(null);
    idadeMaxima = this.formBuilder.control(null);
    obrigatorio = this.formBuilder.control(false);
    dataCadastramento = this.formBuilder.control(null);
    idGrupoDocumento = this.formBuilder.control(null);
    valorRendaMinima = this.formBuilder.control(null);
    valorRendaMaxima = this.formBuilder.control(null);
    codigoUsuarioCadastramento = this.formBuilder.control(null);
    dataInativacao = this.formBuilder.control(null, AscValidators.dataIgualAtualMaior);
    requiredMsg: string; 

    constructor(
        override readonly messageService: MessageService,
        private readonly router: Router,
        private readonly location: Location,
        private readonly route: ActivatedRoute,
        private readonly formBuilder: FormBuilder,
        private readonly comboService: ComboService,
        private readonly serviceDocumento: DocumentoService,
        private readonly serviceGrupoDocumento: GrupoDocumentoService,
        private readonly serviceTipoDeficiencia: TipoDeficienciaService,
        private readonly serviceTipoBeneficiario: TipoBeneficiarioService,
        private readonly serviceCaraterSolicitacao: CaraterSolicitacaoService,
        private readonly serviceDocumentoProcesso: DocumentoTipoProcessoService
    ) {
        super(messageService);
        this.id = this.route.snapshot.params.id;
        this.idTipoProcesso = this.route.snapshot.params.idTipoProcesso;

        this.retornaListaDocumento();
        this.retornaListaTipoDeficiencia();
        this.retornaListaDeGrupoDocumento();
        this.retornaListaCaraterSolicitacao();
        this.consultarEstadoInicialDocumentoProcesso();
        this.requiredMsg = this.bundle('MA007');
    }

    public carregaBeneficiarios(): void {
        if (this.tiposProcesso.value) {
            this.comboService.consultarComboTipoBeneficiarioPorTipoProcesso([this.tiposProcesso.value]).pipe(
                take<DadoComboDTO[]>(1)
            ).subscribe(res => {console.log(res);
                this.listComboTipoBeneficiario = res
                this.listComboTipoBeneficiarioSelecionados = this.listComboTipoBeneficiario.filter(l => 
                                                                    this.documentoTipoProcesso.tiposBeneficiario 
                                                                    && this.documentoTipoProcesso.tiposBeneficiario.includes(l.value) 
                                                                    )
            }, err => this.showDangerMsg(err.error));
        }
    }

    public onChangeProcesso(): void {
        this.tiposBeneficiario.reset();
        this.listComboTipoBeneficiario = [];

        this.carregaBeneficiarios();
    }

    private consultarEstadoInicialDocumentoProcesso(): void {
        if (this.id && this.idTipoProcesso) {
            //this.serviceDocumentoProcesso.get(this.route.snapshot.params["id"]).pipe(
            this.serviceDocumentoProcesso.consultarPorIdETipoProcesso(this.id, this.idTipoProcesso).pipe(
                take<DocumentoTipoProcesso>(1)
            ).subscribe(documentoTipoProcesso => {
                this.documentoTipoProcesso = documentoTipoProcesso;
                this.documentoTipoProcesso.dataInativacao = Util.getDate(documentoTipoProcesso.dataInativacao);
                for (let key in this.documentoTipoProcesso) {
                    if (this.formulario.get(key) != undefined) {
                        this.formulario.get(key).setValue(this.documentoTipoProcesso[key]);
                    }
                }

                this.tiposProcesso.setValue(this.documentoTipoProcesso.idTipoProcesso);
                this.tiposBeneficiario.setValue(this.documentoTipoProcesso.tiposBeneficiario.map(x => Number(x)));
                
                this.retornaListaDocumento();
                this.retornaListaTipoDeficiencia();
                this.retornaListaDeGrupoDocumento();
                this.retornaListaCaraterSolicitacao();

                //Algumas vezes não carrega a combobox de beneficiarios, esta parte força a carga.
                if(!this.listComboTipoBeneficiario || this.listComboTipoBeneficiario.length === 0)
                {
                    this.carregaBeneficiarios();
                }
            });
        }
    }

    formulario: FormGroup = this.formBuilder.group({
        id: this.id,
        sexo: this.sexo,
        inativo: this.inativo,
        idDocumento: this.idDocumento,
        idadeMaxima: this.idadeMaxima,
        idadeMinima: this.idadeMinima,
        obrigatorio: this.obrigatorio,
        tiposProcesso: this.tiposProcesso,
        idEstadoCivil: this.idEstadoCivil,
        dataInativacao: this.dataInativacao,
        idGrupoDocumento: this.idGrupoDocumento,
        valorRendaMinima: this.valorRendaMinima,
        valorRendaMaxima: this.valorRendaMaxima,
        idTipoDeficiencia: this.idTipoDeficiencia,
        dataCadastramento: this.dataCadastramento,
        tiposBeneficiario: this.tiposBeneficiario,
        idMotivoSolicitacao: this.idMotivoSolicitacao,
        idCaraterSolicitacao: this.idCaraterSolicitacao,
        codigoUsuarioCadastramento: this.codigoUsuarioCadastramento
    });

    public retornaListaTipoDeficiencia() {
        this.serviceTipoDeficiencia.consultarTodos().subscribe(result => {
            this.tipoDeficiencias = result.map(item => ({
                label: item.descricao,
                value: item.id
            }));
        });
    }

    public retornaListaDeGrupoDocumento(): void {
        this.serviceGrupoDocumento.consultarTodos().subscribe(result => {
            this.grupoDocumento = result.map(item => ({
                label: item.nome,
                value: item.id
            }));
        });
    }

    public retornaListaCaraterSolicitacao(): void {
        this.serviceCaraterSolicitacao.consultarTodos().take(1).subscribe(result => {
            this.caraterSolicitacao = result.map(item => ({
                label: item.nome,
                value: item.id
            }));
        });
    }

    public retornaListaDocumento(): void {
        this.serviceDocumento.get().take(1).subscribe((result: Documento[]) => {
            this.itensDocumento = result.map(item => ({
                label: item.id + ' - ' + item.nome,
                value: item.id
            }));
        });
    }

    public salvar(): void {
        const documentoTipoProcesso: DocumentoTipoProcesso = this.formulario.value;
        documentoTipoProcesso.valorRendaMinima = NumberUtil.convertStringToNumber(documentoTipoProcesso.valorRendaMinima);
        documentoTipoProcesso.valorRendaMaxima = NumberUtil.convertStringToNumber(documentoTipoProcesso.valorRendaMaxima);
        documentoTipoProcesso.idTipoProcesso = this.tiposProcesso.value;
        documentoTipoProcesso.tiposBeneficiario = this.tiposBeneficiario.value;
        
        if (this.id) {
            this.serviceDocumentoProcesso.put(documentoTipoProcesso).pipe(
                take<DocumentoTipoProcesso>(1)).subscribe(res => {
                this.showSuccessMsg(this.bundle("MA022"));
                this.router.navigate(['manutencao/parametros/documento-pedido/buscar'], {
                    queryParams: {
                        id: res.id,
                        isRetorno: true
                    }
                });
            }, err => this.showDangerMsg(err.error));
        } else {
            this.serviceDocumentoProcesso.post(documentoTipoProcesso).pipe(
                take<DocumentoTipoProcesso>(1)).subscribe(res => {
                this.showSuccessMsg(this.bundle("MA038"));
                this.router.navigate(['manutencao/parametros/documento-pedido/buscar'], {
                    queryParams: {
                        id: res.id,
                        isRetorno: true
                    }
                });
            }, err => this.showDangerMsg(err.error));
        }
    }

    public onChangeInativo(inativo: boolean): void {
        if (inativo) {
            this.dataInativacao.setValue(new Date())
        } else {
            this.dataInativacao.reset();
        }
    }

    public restaurarCampos(): void {
        this.consultarEstadoInicialDocumentoProcesso();
    }

    public limparCampos(): void {
        this.formulario.reset();
        this.formulario.markAsPristine();
        this.formulario.markAsUntouched();
        this.formulario.updateValueAndValidity();
    }

    public excluir(): void {
        this.messageService.addConfirmYesNo(this.bundle("MA021"), () => {
            this.serviceDocumentoProcesso.excluir(this.id).take(1).subscribe(async () => {
                    this.showSuccessMsg(this.bundle("MA039"));
                    await this.router.navigate(['manutencao/parametros/documento-pedido/buscar']);
                }, err => this.showDangerMsg(err.error)
            );
        });
    }

    public voltar(): void {
        this.location.back();
    }
}
