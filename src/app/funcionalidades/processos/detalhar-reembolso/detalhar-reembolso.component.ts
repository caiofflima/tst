import {Component, Input, OnInit} from '@angular/core';
import {BaseComponent} from '../../../../app/shared/components/base.component';
import {ActivatedRoute, Router} from '@angular/router';
import {MessageService} from '../../../../app/shared/components/messages/message.service';
import {ComboService} from '../../../../app/shared/services/comum/combo.service';
import {Beneficiario} from '../../../../app/shared/models/comum/beneficiario';
import {PedidoProcedimento} from '../../../../app/shared/models/comum/pedido-procedimento';
import {Pedido} from '../../../../app/shared/models/comum/pedido';
import {DocumentoPedido} from '../../../../app/shared/models/comum/documento-pedido';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SelectItem} from 'primeng/api';
import {Data} from '../../../../app/shared/providers/data';
import {validarEmail} from '../../../../app/shared/validators/validador-email.directive';
import {take} from "rxjs/operators";
import {AutorizacaoPreviaService} from "../../../shared/services/comum/pedido/autorizacao-previa.service";
import {BeneficiarioService} from "../../../shared/services/comum/beneficiario.service";
import {DocumentoTipoProcessoService} from "../../../shared/services/comum/documento-tipo-processo.service";
import {HistoricoProcessoService} from "../../../shared/services/comum/historico-processo.service";
import {LocalidadeService} from "../../../shared/services/comum/localidade.service";
import {SIASCFluxoService} from "../../../shared/services/comum/siasc-fluxo.service";
import {ProcedimentoPedidoService} from "../../../shared/services/comum/procedimento-pedido.service";
import {MensagemPedidoService} from "../../../shared/services/comum/mensagem-enviada.service";
import {MotivoNegacaoService} from "../../../shared/services/comum/motivo-negacao.service";
import {MotivoSolicitacaoService} from "../../../shared/services/comum/motivo-solicitacao.service";
import {CaraterSolicitacaoService} from "../../../shared/services/comum/carater-solicitacao.service";
import {TipoOcorrenciaService} from "../../../shared/services/comum/tipo-ocorrencia.service";
import {SessaoService} from "../../../arquitetura/shared/services/seguranca/sessao.service";
import {CaraterSolicitacao, TipoOcorrencia} from "../../../shared/models/entidades";

@Component({
    selector: 'app-detalhar-reembolso',
    templateUrl: './detalhar-reembolso.component.html',
    styleUrls: ['./detalhar-reembolso.component.scss'],
    providers: [ComboService]
})
export class DetalharReembolsoComponent extends BaseComponent implements OnInit {

    public nDoc: string = '';
    public mask: string = ''
    form: FormGroup;
    @Input('pedido')
    pedido: Pedido;
    titular: Beneficiario;
    beneficiario: Beneficiario;
    tipoProcesso: any;
    motivoSolicitacao: any;
    situacaoPedido: any;
    listaPedidosProcedimento: PedidoProcedimento[];
    listaDocumentosRequeridos: any[];
    listaHistoricoProcesso: any[];
    listaMensagensPedido: any[];
    documentosPedido: DocumentoPedido[];
    mensagensPedido: any[];
    itensConselhoProfissional: SelectItem[];
    itensLocalidade: SelectItem[];
    itensCaracteresSolicitacao: SelectItem[];
    itensMotivoNegacao: SelectItem[];
    itensTipoOcorrencia: SelectItem[];
    itensFinalidade: SelectItem[];
    ufAtendimento: AbstractControl;
    situacaoProcessoSelecionada: AbstractControl;

    constructor(
        override readonly messageService: MessageService,
        private readonly fb: FormBuilder,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly data: Data,
        private readonly siascFluxoService: SIASCFluxoService,
        private readonly documentoTipoProcessoService: DocumentoTipoProcessoService,
        private readonly beneficiarioService: BeneficiarioService,
        private readonly pedidoProcedimentoService: ProcedimentoPedidoService,
        private readonly mensagemPedidoService: MensagemPedidoService,
        private readonly tipoOcorrenciaService: TipoOcorrenciaService,
        private readonly caraterSolicitacaoService: CaraterSolicitacaoService,
        private readonly motivoSolicitacaoService: MotivoSolicitacaoService,
        private readonly motivoNegacaoService: MotivoNegacaoService,
        private readonly localidadeService: LocalidadeService,
        private readonly historicoProcessoService: HistoricoProcessoService,
        private readonly autorizacaoPreviaService: AutorizacaoPreviaService,
        private readonly comboService: ComboService
    ) {
        super(messageService);
        this.ufAtendimento = this.fb.control(null, Validators.required);
        this.situacaoProcessoSelecionada = this.fb.control(null, Validators.required);
        this.initForm();
        this.listaDocumentosRequeridos = [];
        this.listaPedidosProcedimento = [];
        this.listaHistoricoProcesso = [];
        this.listaMensagensPedido = [];
    }

    get idConselhoProfissional(): AbstractControl {
        return this.form.get('idConselhoProfissional');
    }

    get numeroConselho(): AbstractControl {
        return this.form.get('numeroConselho');
    }

    get idEstadoConselho(): AbstractControl {
        return this.form.get('idEstadoConselho');
    }

    get cpfCnpj(): AbstractControl {
        return this.form.get('cpfCnpj');
    }

    get nomeProfissional(): AbstractControl {
        return this.form.get('nomeProfissional');
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

    ngOnInit() {
        this.configurarDadosTitular();
        this.configurarDadosPedido();
        this.initForm();
    }

    public configurarDadosTitular(): void {
        const matricula = SessaoService.getMatriculaFuncional();
        this.beneficiarioService.consultarTitularPorMatricula(matricula).subscribe(res => {
            this.titular = res;
        }, err => this.showDangerMsg(err.error));
    }

    public configurarDadosPedido(): void {
        if (this.data.storage) {
            this.pedido = this.data.storage.pedido;
        }

        if (!this.pedido || !this.pedido.id) {
            this.router.navigateByUrl('/meus-dados/pedidos');
        } else {
            this.autorizacaoPreviaService.consultarPorId(this.pedido.id).subscribe(res => {
                this.pedido = res;
                this.beneficiario = this.pedido.beneficiario;
                this.tipoProcesso = this.pedido.tipoProcesso;
                this.configurarListas();
                this.preencherDadosForm();
                this.siascFluxoService.consultarPermissoesFluxoPorPedido(this.pedido.id).subscribe(r => JSON.stringify(r), error => this.showDangerMsg(error.error));
            }, () => this.showDangerMsg('MA00H'));
        }
    }


    private configurarListas(): void {
        this.documentoTipoProcessoService.consultarRequeridosPorIdPedido(this.pedido.id).subscribe(res => {
            this.listaDocumentosRequeridos = res;
        }, error => this.showDangerMsg(error.error));

        this.pedidoProcedimentoService.consultarPedidosProcedimentoPorPedido(this.pedido.id).subscribe(res => {
            this.listaPedidosProcedimento = res;
        }, error => this.showDangerMsg(error.error));

        this.carregarListaHistoricoProcesso();

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

        this.itensConselhoProfissional = [];
        this.comboService.consultarComboConselhosProfissionais().subscribe(res => {
            this.itensConselhoProfissional = res;
            this.idConselhoProfissional.setValue(this.pedido.idConselhoProfissional);

        }, error => this.showDangerMsg(error.error));

        this.mensagemPedidoService.consultarPorIdPedido(this.pedido.id).subscribe(res => {
            this.listaMensagensPedido = res;
        }, error => this.showDangerMsg(error.error));

        this.itensLocalidade = []
        this.localidadeService.consultarMunicipiosPorSgUF('AM').subscribe(res => {
            for (let l of res) {
                this.itensLocalidade.push({label: l.nome, value: l.id});
            }
            this.idMunicipioProfissional.setValue(this.pedido.idMunicipioProfissional);
        });
    }

    private carregarListaHistoricoProcesso(): void {
        this.historicoProcessoService.consultarPorIdPedido(this.pedido.id).pipe(take(1)).subscribe((res: any[]) => {
            this.listaHistoricoProcesso = res;
            this.situacaoPedido = null;
            for (let sped of this.listaHistoricoProcesso) {
                if (null == this.situacaoPedido || sped.dataCadastramento > this.situacaoPedido.dataCadastramento) {
                    this.situacaoPedido = sped;
                }
            }
        }, error => this.showDangerMsg(error.error));
    }

    private initForm(): void {
        this.form = this.fb.group({
            idBeneficiario: this.fb.control(this.pedido ? this.pedido.idBeneficiario : '', Validators.required),
            idTipoProcesso: this.fb.control(this.pedido ? this.pedido.idTipoProcesso : '', Validators.required),
            idMotivoSolicitacao: this.fb.control(this.pedido ? this.pedido.idMotivoSolicitacao : '', Validators.required),
            pedidosProcedimento: this.fb.control(this.pedido ? this.pedido.pedidosProcedimento : '', Validators.required),
            idMunicipioProfissional: this.fb.control(this.pedido ? this.pedido.idMunicipioProfissional : '', Validators.required),
            idConselhoProfissional: this.fb.control(this.pedido ? this.pedido.idConselhoProfissional : '', Validators.required),
            idCaraterSolicitacao: this.fb.control(this.pedido ? this.pedido.idCaraterSolicitacao : '', Validators.required),
            idEstadoConselho: this.fb.control(this.pedido ? this.pedido.idEstadoConselho : '', Validators.required),
            numeroConselho: this.fb.control(this.pedido ? this.pedido.numeroConselho : '', Validators.required),
            cpfCnpj: this.fb.control(this.pedido ? this.pedido.cpf || this.pedido.cnpj : '', Validators.required),
            nomeProfissional: this.fb.control(this.pedido ? this.pedido.nomeProfissional : '', Validators.required),
            email: this.fb.control(this.pedido ? this.pedido.email : '', validarEmail()),
            telefoneContato: this.fb.control(this.pedido ? this.pedido.telefoneContato : ''),
            observacao: this.fb.control(this.pedido ? this.pedido.observacao : '')
        });
    }

    mascara(nDoc) {
        if (nDoc.lenght >= 11) {
            return "99.999.999/9999-99";
        } else {
            return "999.999.999-99";
        }
    }

    public realizarUpload(files: File[], compRef): void {
        this.autorizacaoPreviaService.upload(new FormData()).subscribe(() => {
            this.showSuccessMsg('MA088');
            compRef.clear();
            this.carregarListaHistoricoProcesso();
        }, () => this.showDangerMsg('MA00M'));
    }

    novoProcedimento() {
        this.router.navigateByUrl('/meus-dados/pedidos/novo-procedimento');
    }

    analisarProcessos() {
        this.router.navigateByUrl('/meus-dados/pedidos/analisar');
    }

    voltarProcessos() {
        this.router.navigateByUrl('/meus-dados/pedidos');
    }

    detalharProcesso() {
        this.router.navigateByUrl('/meus-dados/pedidos/detalhar');
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
            this.form.get('cpfCnpj').setValue(this.pedido.cpf ? this.pedido.cpf : this.pedido.cnpj);
            this.form.get('nomeProfissional').setValue(this.pedido.nomeProfissional);
            this.form.get('email').setValue(this.pedido.email);
            this.form.get('telefoneContato').setValue(this.pedido.telefoneContato);
            this.form.get('observacao').setValue(this.pedido.observacao);
            this.ufAtendimento.setValue('AM');
            this.ufAtendimento.setValue('AM');
        }
    }

    public atualizarSituacaoProcesso(): void {
        this.autorizacaoPreviaService.atualizarSituacaoProcesso(this.pedido.id, this.situacaoProcessoSelecionada.value).subscribe(() => {
            this.carregarListaHistoricoProcesso();
        }, error => this.showDangerMsg(error.error));
    }
}
