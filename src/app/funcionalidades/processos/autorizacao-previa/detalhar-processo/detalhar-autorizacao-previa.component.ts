import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {BaseComponent} from '../../../../shared/components/base.component';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {MessageService} from '../../../../shared/components/messages/message.service';

import {AscAnexosPedidoComponent} from '../../../../shared/components/pedido/anexos-pedido/anexos-pedido.component';
import {
    AscAtualizarSituacaoProcessoComponent
} from '../../../../shared/components/pedido/atualizar-situacao-processo/atualizar-situacao-processo.component';
import {
    AscProfissionalExecutanteComponent
} from '../../../../shared/components/autorizacao-previa/profissional-executante/profissional-executante.component';
import {
    AscHistoricoProcessoComponent
} from '../../../../shared/components/pedido/historico-processo/historico-processo.component';
import {
    AscMensagensEnviadasComponent
} from '../../../../shared/components/pedido/mensagens-enviadas/mensagens-enviadas.component';
import {
    AscRelacaoDocumentosUploadComponent
} from '../../../../shared/components/pedido/relacao-documentos-upload/relacao-documentos-upload.component';
import {ComboService} from '../../../../shared/services/comum/combo.service';
import {PermissoesSituacaoProcesso} from '../../../../shared/models/fluxo/permissoes-situacao-processo';
import {Beneficiario} from '../../../../shared/models/comum/beneficiario';
import {PedidoProcedimento} from '../../../../shared/models/comum/pedido-procedimento';
import {Pedido} from '../../../../shared/models/comum/pedido';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { TabPanel } from 'primeng/tabview';
import {Data} from '../../../../shared/providers/data';
import {validarCpfOuCnpj, validarEmails} from '../../../../shared/validators/validadors.directive';
import * as constantes from '../../../../shared/constantes';
import {AutorizacaoPreviaService} from "../../../../shared/services/comum/pedido/autorizacao-previa.service";
import {BeneficiarioService} from "../../../../shared/services/comum/beneficiario.service";
import {SIASCFluxoService} from "../../../../shared/services/comum/siasc-fluxo.service";
import {ProcedimentoPedidoService} from "../../../../shared/services/comum/procedimento-pedido.service";
import {TipoOcorrenciaService} from "../../../../shared/services/comum/tipo-ocorrencia.service";
import {MotivoSolicitacaoService} from "../../../../shared/services/comum/motivo-solicitacao.service";
import {MotivoNegacaoService} from "../../../../shared/services/comum/motivo-negacao.service";
import {CaraterSolicitacaoService} from "../../../../shared/services/comum/carater-solicitacao.service";
import {SessaoService} from "../../../../arquitetura/shared/services/seguranca/sessao.service";
import {take} from "rxjs/operators";
import {TipoOcorrencia} from "../../../../shared/models/dto/tipo-ocorrencia";
import {CaraterSolicitacao} from "../../../../shared/models/comum/carater-solicitacao";

@Component({
    selector: 'app-detalhar-autorizacao-previa',
    templateUrl: 'detalhar-autorizacao-previa.component.html',
    styleUrls: ['detalhar-autorizacao-previa.component.scss'],
    providers: [ComboService]
})
export class DetalharAutorizacaoPreviaComponent extends BaseComponent implements OnInit, AfterViewInit {


    tabIndex: number;
    @ViewChild('tabSituacaoProcesso')
    tabSituacaoProcesso: TabPanel;

    @ViewChild('anexosPedido')
    anexosPedidoComponent: AscAnexosPedidoComponent;
    @ViewChild('atualizarSituacaoProcesso')
    atualizarSituacaoProcessoComponent: AscAtualizarSituacaoProcessoComponent;
    @ViewChild('historicoProcesso')
    historicoProcessoComponent: AscHistoricoProcessoComponent;
    @ViewChild('mensagensEnviadas')
    mensagensEnviadasComponent: AscMensagensEnviadasComponent;
    @ViewChild('relacaoDocumentosUpload')
    relacaoDocumentosUploadComponent: AscRelacaoDocumentosUploadComponent;

    @ViewChild('profissionalExecutante')
    profissionalExecutanteComponent: AscProfissionalExecutanteComponent;
    @Output('onUpdate')
    emitter: EventEmitter<any>;

    @Input('permissoesProcesso')
    permissoesProcesso: PermissoesSituacaoProcesso;
    @Input('pedido')
    pedido: Pedido;
    @Input('titular')
    titular: Beneficiario;

    public nDoc: string = '';
    public mask: string = ''
    form: FormGroup;

    beneficiario: Beneficiario;
    tipoProcesso: any;
    motivoSolicitacao: any;
    listaPedidosProcedimento: PedidoProcedimento[];
    mensagensPedido: any[];
    itensCaracteresSolicitacao: SelectItem[];
    itensMotivoNegacao: SelectItem[];
    itensTipoOcorrencia: SelectItem[];
    itensFinalidade: SelectItem[];
    voltarPara: string;

    constructor(
        override readonly messageService: MessageService,
        private readonly caraterSolicitacaoService: CaraterSolicitacaoService,
        private readonly motivoSolicitacaoService: MotivoSolicitacaoService,
        private readonly motivoNegacaoService: MotivoNegacaoService,
        private readonly tipoOcorrenciaService: TipoOcorrenciaService,
        private readonly pedidoProcedimentoService: ProcedimentoPedidoService,
        private readonly siascFluxoService: SIASCFluxoService,
        private readonly autorizacaoPreviaService: AutorizacaoPreviaService,
        private readonly beneficiarioService: BeneficiarioService,
        private readonly fb: FormBuilder,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly data: Data
    ) {
        super(messageService);
        this.listaPedidosProcedimento = [];
        this.emitter = new EventEmitter<any>();
        this.initForm();
    }

    get ufAtendimento(): AbstractControl {
        return this.form.get('ufAtendimento');
    }

    get idMunicipioProfissional(): AbstractControl {
        return this.form.get('idMunicipioProfissional');
    }

    get pedidosProcedimento(): AbstractControl {
        return this.form.get('pedidosProcedimento');
    }

    get idCaraterSolicitacao(): AbstractControl {
        return this.form.get('idCaraterSolicitacao');
    }

    get email(): AbstractControl {
        return this.form.get('email');
    }

    get telefoneContato(): AbstractControl {
        return this.form.get('telefoneContato');
    }

    get observacao(): AbstractControl {
        return this.form.get('observacao');
    }

    get cpfCnpj(): AbstractControl {
        return this.form.get('cpfCnpj');
    }

    get cpf(): AbstractControl {
        return this.form.get('cpf');
    }

    get cnpj(): AbstractControl {
        return this.form.get('cnpj');
    }

    ngOnInit() {
        this.tabSituacaoProcesso.closed = true;
        this.configurarDadosPedido();
        this.initForm();
        this.route.params.subscribe(
            param => {
                this.voltarPara = param['origem'];
            }
        );
    }

    ngAfterViewInit(): void {
        this.atualizarSituacaoProcesso();
        this.atualizarInformacoesDocumentos();
        this.atualizarPermissoes();
        constantes.cpfUtil.control.configurarMascara(this.cpfCnpj);
    }

    private verificarBloqueioCampos(): void {
        Object.keys(this.form.controls).forEach(key => {
            if (this.hasAcaoEdicao()) {
                this.form.get(key).enable();
            } else {
                this.form.get(key).disable();
            }
        });
        this.tabSituacaoProcesso.closed = !this.hasAcaoAnalise();
    }

    public configurarDadosPedido(): void {
        if (this.data.storage && !this.pedido) {
            this.pedido = this.data.storage.pedido;
        }

        if (!this.pedido || !this.pedido.id) {
            this.router.navigateByUrl('/home');
        } else {
            this.autorizacaoPreviaService.consultarPorId(this.pedido.id).subscribe(res => {
                this.pedido = res;
                this.beneficiarioService.consultarBeneficiarioPorId(this.pedido.idBeneficiario).pipe(
                    take<Beneficiario>(1)
                ).subscribe(r => this.beneficiario = r, error => this.messageService.addMsgDanger(error.error));
                this.verificarBloqueioCampos();
                this.tipoProcesso = this.pedido.tipoProcesso;
                this.configurarListas();
                this.preencherDadosForm();
                this.profissionalExecutanteComponent.carregarItensComboMunicipioProfissional(this.idMunicipioProfissional.value);
                constantes.cpfCnpjUtil.control.configurarMascara(this.cpfCnpj);
                this.atualizarSituacaoProcessoComponent.limparCampos();
            }, () => this.showDangerMsg('MA00H'));
        }
    }

    private atualizarPermissoes(): void {
        this.siascFluxoService.consultarPermissoesFluxoPorPedido(this.pedido.id).subscribe(res => {
            this.permissoesProcesso = res;
            if (!this.permissoesProcesso.acessar) {
                this.router.navigateByUrl('/home');
                this.showDangerMsg('MA001');
            } else {
                this.verificarBloqueioCampos();
            }
        }, error => this.showDangerMsg(error.error));
    }

    private configurarListas(): void {
        this.atualizarPedidosProcedimento();
        this.itensTipoOcorrencia = [];
        this.tipoOcorrenciaService.get().pipe(
            take<TipoOcorrencia[]>(1)
        ).subscribe(res => {
            for (let to of res) {
                this.itensTipoOcorrencia.push({label: to.nome, value: to.id});
            }
        });

        this.itensMotivoNegacao = [];
        this.motivoNegacaoService.consultarMotivosNegacaoProcessoPorPedido(this.pedido.id).subscribe(res => {
            for (let mn of res) {
                this.itensMotivoNegacao.push({label: mn.titulo, value: mn});
            }
        });


        this.itensFinalidade = [];
        this.motivoSolicitacaoService.get(this.pedido.idMotivoSolicitacao).subscribe(res => {
            this.motivoSolicitacao = res;
        }, error => this.showDangerMsg(error.error));

        this.itensCaracteresSolicitacao = [];
        this.caraterSolicitacaoService.get().pipe(
            take<CaraterSolicitacao[]>(1)
        ).subscribe(res => {
            for (let cs of res) {
                this.itensCaracteresSolicitacao.push({label: cs.nome, value: cs.id});
            }
            this.idCaraterSolicitacao.setValue(this.pedido.idCaraterSolicitacao);
        }, error => this.showDangerMsg(error.error));

    }

    private initForm(): void {
        this.form = this.fb.group({
            id: this.fb.control(this.pedido ? this.pedido.id : null, Validators.required),
            idBeneficiario: this.fb.control(this.pedido ? this.pedido.idBeneficiario : '', Validators.required),
            idTipoProcesso: this.fb.control(this.pedido ? this.pedido.idTipoProcesso : '', Validators.required),
            idMotivoSolicitacao: this.fb.control(this.pedido ? this.pedido.idMotivoSolicitacao : '', Validators.required),
            pedidosProcedimento: this.fb.control(this.pedido ? this.pedido.pedidosProcedimento : ''),
            ufAtendimento: this.fb.control(null, Validators.required),
            idMunicipioProfissional: this.fb.control(this.pedido ? this.pedido.idMunicipioProfissional : '', Validators.required),
            idConselhoProfissional: this.fb.control(this.pedido ? this.pedido.idConselhoProfissional : '', Validators.required),
            idCaraterSolicitacao: this.fb.control(this.pedido ? this.pedido.idCaraterSolicitacao : '', Validators.required),
            idEstadoConselho: this.fb.control(this.pedido ? this.pedido.idEstadoConselho : '', Validators.required),
            numeroConselho: this.fb.control(this.pedido ? this.pedido.numeroConselho : '', Validators.required),
            cpfCnpj: this.fb.control(DetalharAutorizacaoPreviaComponent.getValorCpfCnpj(this.pedido), [Validators.required, validarCpfOuCnpj()]),
            cnpj: this.fb.control(this.pedido && this.pedido.cnpj ? this.pedido.cnpj : ''),
            cpf: this.fb.control(this.pedido && this.pedido.cpf ? this.pedido.cpf : ''),
            nomeProfissional: this.fb.control(this.pedido ? this.pedido.nomeProfissional : '', Validators.required),
            email: this.fb.control(this.pedido ? this.pedido.email : '', validarEmails()),
            telefoneContato: this.fb.control(this.pedido ? this.pedido.telefoneContato : ''),
            observacao: this.fb.control(this.pedido ? this.pedido.observacao : '')
        });
    }

    private static getValorCpfCnpj(pedido: Pedido): string {
        let strCpfCnpj = '';
        if (pedido) {
            if (pedido.cpf) {
                strCpfCnpj = pedido.cpf;
            } else if (pedido.cnpj) {
                strCpfCnpj = pedido.cnpj;
            }
        }
        return strCpfCnpj;
    }

    private preencherDadosForm(): void {
        if (this.form && this.pedido) {
            this.form.get('idBeneficiario').setValue(this.pedido.idBeneficiario);
            this.form.get('idTipoProcesso').setValue(this.pedido.idTipoProcesso);
            this.form.get('idMotivoSolicitacao').setValue(this.pedido.idMotivoSolicitacao);
            this.form.get('idMunicipioProfissional').setValue(this.pedido.idMunicipioProfissional);
            this.form.get('idConselhoProfissional').setValue(this.pedido.idConselhoProfissional + '');
            this.form.get('idCaraterSolicitacao').setValue(this.pedido.idCaraterSolicitacao);
            this.form.get('idEstadoConselho').setValue(this.pedido.idEstadoConselho);
            this.form.get('numeroConselho').setValue(this.pedido.numeroConselho);
            this.pedidosProcedimento.setValue(this.pedido.pedidosProcedimento);
            this.form.get('cpfCnpj').setValue(this.pedido.cpf ? this.pedido.cpf : this.pedido.cnpj);
            this.form.get('nomeProfissional').setValue(this.pedido.nomeProfissional);
            this.form.get('email').setValue(this.pedido.email);
            this.form.get('telefoneContato').setValue(constantes.formatarTelefone(this.pedido.telefoneContato ? this.pedido.telefoneContato.toString() : ''));
            this.form.get('observacao').setValue(this.pedido.observacao);
            this.form.get('ufAtendimento').setValue(this.pedido.municipioProfissional.estado.id);
        }
    }


    mascara(nDoc) {
        if (nDoc.lenght >= 11) {
            return "99.999.999/9999-99";
        } else {
            return "999.999.999-99";
        }
    }

    novoProcedimento() {
        this.data.storage.tipoProcesso = this.tipoProcesso;
        this.navigateTo('/meus-dados/pedidos/novo-procedimento');
    }

    navigateTo(navTo: string): void {
        const valor = btoa('/meus-dados/pedidos/detalhar/' + this.voltarPara);
        this.router.navigateByUrl(navTo + '/' + valor);
    }

    public restaurarCamposPedido(): void {
        this.configurarDadosPedido();
    }

    public liberarProcessoParaAnalise(): void {
        this.autorizacaoPreviaService.liberarProcessoParaAnalise(this.pedido.id).subscribe(res => {
            let avisos = res.msgsAviso;
            let msg = '';
            for (let m of avisos) {
                msg = msg.concat(m).concat(' ');
            }
            this.atualizarPermissoes();
            this.atualizarHistoricoPedido();
            this.atualizarMensagensEnviadas();
            this.atualizarSituacaoProcesso();
            if (msg.length > 0) {
                this.showAlertDialog('Alertas', msg);
            }
        }, error => this.showDangerMsg(error.error));
    }

    analisarProcessos() {
        this.navigateTo('/meus-dados/pedidos/analisar');
    }

    voltarProcessos() {
        let vltrPara = atob(this.voltarPara);
        this.router.navigateByUrl(vltrPara);
    }

    public realizarUpload(formData: FormData): Observable<any> {
        return this.autorizacaoPreviaService.upload(formData);
    }

    public atualizarInformacoesDocumentos(): void {
        if (this.relacaoDocumentosUploadComponent) {
            this.relacaoDocumentosUploadComponent.atualizarInformacoes(this.pedido.id);
        }
        this.atualizarAnexosPedido();
    }

    public atualizarPedidosProcedimento(): void {
        this.pedidoProcedimentoService.consultarPedidosProcedimentoPorPedido(this.pedido.id).subscribe(res => {
            this.listaPedidosProcedimento = res;
            this.pedidosProcedimento.setValue(res);
        }, error => this.showDangerMsg(error.error));

    }

    public atualizarAnexosPedido(): void {
        if (this.anexosPedidoComponent) {
            this.anexosPedidoComponent.atualizarInformacoes(this.pedido.id);
        }
    }

    public atualizarHistoricoPedido(): void {
        if (this.historicoProcessoComponent) {
            this.historicoProcessoComponent.atualizarInformacoes(this.pedido.id);
            this.emitter.emit(this.pedido.id);
        }
    }

    public atualizarMensagensEnviadas(): void {
        if (this.mensagensEnviadasComponent) {
            this.mensagensEnviadasComponent.atualizarInformacoes(this.pedido.id);
        }
    }

    public atualizarSituacaoProcesso(): void {
        if (this.atualizarSituacaoProcessoComponent) {
            this.atualizarSituacaoProcessoComponent.atualizarInformacoes(this.pedido.id);
        }
        this.atualizarHistoricoPedido();
        this.atualizarMensagensEnviadas();
    }

    public atualizarSucessoUpload(_: any): void {
        this.atualizarHistoricoPedido();
        this.atualizarMensagensEnviadas();
        this.atualizarPermissoes();
    }

    public salvarProcesso() {
        this.pedidosProcedimento.setValue(this.listaPedidosProcedimento);
        if (this.form.valid) {
            let cpfCnpj = this.form.get('cpfCnpj').value;
            cpfCnpj = constantes.somenteNumeros(cpfCnpj);
            constantes.control.somenteNumeros(this.telefoneContato);
            if (cpfCnpj.length == 11) {
                this.cpf.setValue(cpfCnpj);
                this.cnpj.setValue(null);
            } else if (cpfCnpj.length == 14) {
                this.cpf.setValue(null);
                this.cnpj.setValue(cpfCnpj);
            }
            this.autorizacaoPreviaService.atualizar(this.form.value).subscribe(() => {
                this.showSuccessMsg('MA085');
                constantes.control.formatarTelefone(this.telefoneContato);
            }, error => this.showDangerMsg(error.error));
        } else {
            this.validateAllFormFields(this.form);
            if (this.cpfCnpj.errors && this.cpfCnpj.errors['cpfCnpjInvalido']) {
                this.showDangerMsg('MA009', 'CPF ou CNPJ');
            } else {
                this.showDangerMsg('MA007');
            }
        }
    }

    public cancelarPedido(): void {
        this.autorizacaoPreviaService.cancelarPedido(this.pedido.id).subscribe(() => {
            this.pedido.ultimaSituacao.situacaoProcesso.conclusivo = 'SIM';
            this.showSuccessMsg('MA00O');
            this.atualizarSituacaoProcesso();
            this.atualizarPermissoes();
        }, error => this.showDangerMsg(error.error));
    }

    public hasAcaoEdicao(): boolean {
        return this.permissoesProcesso ? this.permissoesProcesso.editar : false;
    }


    public hasAcaoAnalise(): boolean {
        return this.permissoesProcesso ? this.permissoesProcesso.analisar : false;
    }

    public hasLiberarProcessoParaAnalise(): boolean {
        return false;
    }

    public podeCancelar(): boolean {
        let flg = false;
        const matricula = SessaoService.getMatriculaFuncional();
        if (this.pedido && this.pedido.ultimaSituacao && this.pedido.ultimaSituacao.situacaoProcesso) {
            if (this.pedido.ultimaSituacao.situacaoProcesso.conclusivo == 'NAO') {
                if (matricula && this.titular) {
                    if (matricula.toUpperCase() == this.titular.matriculaFuncional) {
                        flg = true;
                    }
                }
            }
        }
        return flg;
    }

    public isAutorizacaoODT(): boolean {
        let flg = false;
        if (this.tipoProcesso) {
            flg = constantes.tipoProcesso.autorizacaoPrevia.isODT(this.tipoProcesso.id);
        }
        return flg;
    }

    override get constantes(): any {
        return constantes;
    }

    public atualizarInformacoesMudancaSituacao($event: any): void {
        this.emitter.emit($event);
        this.atualizarPermissoes();
        this.tabIndex = 0;
    }
}
