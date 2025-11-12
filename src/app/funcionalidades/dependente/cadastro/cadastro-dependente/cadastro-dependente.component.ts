import {ChangeDetectorRef, Component} from '@angular/core';
import {Subject, Subscription} from "rxjs";

import {BaseComponent} from "../../../../shared/components/base.component";
import {DocumentoTipoProcesso} from "../../../../shared/models/dto/documento-tipo-processo";
import {ReciboModel} from '../../models/recibo-form.model';
import {DadoComboDTO} from '../../../../shared/models/dto/dado-combo';
import {TipoDeficiencia} from '../../../../shared/models/comum/tipo-deficiencia';
import {TipoDependente} from '../../../../shared/models/comum/tipo-dependente'
import {DadosDependenteFormModel} from "../../models/dados-dependente-form.model";
import {BeneficiarioDependenteFormModel} from "../../models/beneficiario-dependente-form.model";
import {ComplementoDependenteFormModel} from "../../models/complemento-dependente.form.model"
import {DocumentoParam} from "../../../../shared/components/asc-pedido/models/documento.param";
import {NumberUtil} from "../../../../shared/util/number-util";
import {Beneficiario, EstadoCivil, Municipio, TipoProcesso} from "../../../../shared/models/entidades";
import {Atendimento} from "app/shared/models/comum/atendimento";
import {AtendimentoService} from "app/shared/services/comum/atendimento.service";
import {MessageService} from "../../../../shared/components/messages/message.service";
import {SessaoService, BeneficiarioService, InscricaoDependenteService} from '../../../../shared/services/services';
import { take } from 'rxjs/operators';
import {TipoBeneficiarioDTO} from "../../../../shared/models/dto/tipo-beneficiario";
@Component({
    selector: 'asc-cadastro-dependente',
    templateUrl: './cadastro-dependente.component.html',
    styleUrls: ['./cadastro-dependente.component.scss']
})
export class CadastroDependenteComponent extends BaseComponent {
    readonly idTipoProcesso = 11;

    uf: DadoComboDTO = null;
    municipio: Municipio = null;
    documentos: DocumentoTipoProcesso[] = [];
    reinicarSubject: Subject<void> = new Subject<void>();
    processoEnviado: boolean = false;
    recibo: ReciboModel;
    beneficiarioDependenteModel?: BeneficiarioDependenteFormModel;
    dadoDependenteModel?: DadosDependenteFormModel;
    complementoDependenteModel?: ComplementoDependenteFormModel;
    estado: DadoComboDTO;
    tipoDeficienciaModel: TipoDeficiencia;
    tipoDependenteModel: TipoBeneficiarioDTO;
    estadoCivilModel: EstadoCivil;
    beneficiarioModel?: Beneficiario;
    tipoProcesso: TipoProcesso;
    parametroDocumento: DocumentoParam = {};
    breadcrumb: Array<string> = [
        "Novo Pedido", "Beneficiário ", "Inscrição de Dependente"
    ];
    versao = 0;

    matricula: string;
    listaBeneficiarios:Beneficiario[]=[];
    private atendimentoSubject: Subscription;

    constructor(
        messageService: MessageService, 
        private beneficiarioService: BeneficiarioService,
        readonly sessaoService: SessaoService,
        private readonly atendimentoService: AtendimentoService,
        readonly changeDetectorRef: ChangeDetectorRef,
        protected inscricaoDependenteService: InscricaoDependenteService,
        ) {
        super(messageService);
        this.reinicarSubject.subscribe(() => {
            this.versao++
        });
    }

    ngOnInit(): void {
        this.inscricaoDependenteService.setEditMode(false);
        this.carregarAtendimento();
    }

    ngAfterViewChecked(): void {
        this.changeDetectorRef.detectChanges();
    }

    carregarBeneficiarios(){
        this.beneficiarioService.consultarTodaFamiliaPorMatriculaRenovacao(this.matricula).subscribe(
            familia => {
                this.beneficiarioService.consultarTitularPorMatricula(this.matricula, false).subscribe(
                    titular => {
                        if (titular && !familia.some(b => b.id === titular.id)) {
                            this.listaBeneficiarios = [titular, ...familia];
                        } else {
                            this.listaBeneficiarios = familia;
                        }
                    },
                    () => this.listaBeneficiarios = familia
                );
            },
            err => {
                this.messageService.addMsgDanger(err.error);
            }
        );		
    }

    carregarAtendimento(){
        if (SessaoService.usuario.menu.map(m => m.label).filter( m => m.includes('Atendimento'))) {
            this.atendimentoService.get().pipe(take(1)).subscribe((atendimento: Atendimento) => {
                if (atendimento) {
                    AtendimentoService.atendimento = atendimento;
                    AtendimentoService.changed.next(atendimento);
                }
            }, error => this.messageService.addMsgDanger(error.error));
    
            this.atendimentoSubject = AtendimentoService.changed.subscribe((atendimento: Atendimento) => {

                if (atendimento) {
                    this.matricula = atendimento.matricula;
                    this.carregarBeneficiarios();
                }
            }, error => this.messageService.addMsgDanger(error.error));
        }
    }


    tipoDependenteModelSelecionado(tipoDependenteModel: TipoBeneficiarioDTO) {

        if (this.tipoDependenteModel) {
            this.parametroDocumento.idTipoBeneficiario = this.tipoDependenteModel.id
            this.parametroDocumento = {...this.parametroDocumento}
        } else {
            this.parametroDocumento.idTipoBeneficiario = null;
        }
        this.tipoDependenteModel = tipoDependenteModel;
    }

    beneficiarioDependenteModelSelecionado(beneficiarioDependenteModel: BeneficiarioDependenteFormModel) {
        this.beneficiarioDependenteModel = beneficiarioDependenteModel;
        if (!this.parametroDocumento || (this.parametroDocumento.idTipoProcesso != this.idTipoProcesso)
            || (this.beneficiarioDependenteModel && (this.parametroDocumento.idTipoBeneficiario != this.beneficiarioDependenteModel.idTipoBeneficiario))) {
            this.parametroDocumento = {
                idTipoBeneficiario: this.beneficiarioDependenteModel.idTipoBeneficiario,
                idTipoProcesso: this.idTipoProcesso,
            };

        }
    }

    getAge(birthDate: Date): number {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();

        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    dadoDependenteModelSelecionado(dadosDependenteModel: DadosDependenteFormModel) {
        this.dadoDependenteModel = dadosDependenteModel;
    }

    complementoDependenteModelSelecionado(complementoDependenteModel: ComplementoDependenteFormModel) {
        this.complementoDependenteModel = complementoDependenteModel;
        if (complementoDependenteModel) {
            this.parametroDocumento = {
                idTipoProcesso: this.idTipoProcesso,
                idTipoBeneficiario: this.beneficiarioDependenteModel.idTipoBeneficiario,
                sexo: this.dadoDependenteModel.sexo as string,
                idEstadoCivil: this.dadoDependenteModel.idEstadoCivil,
                idade: this.getAge(this.dadoDependenteModel.dataNascimento),
                idTipoDeficiencia: this.tipoDeficienciaModel ? this.tipoDeficienciaModel.id : null,
                valorRenda: NumberUtil.convertStringToNumber(this.complementoDependenteModel.renda),
                //idCaraterSolicitacao: this.documentos[0].idCaraterSolicitacao ? this.documentos[0].idCaraterSolicitacao: null,
            }
        } else {
            this.parametroDocumento = null;
        }
    }

    documentosSelecionados(documentos: DocumentoTipoProcesso[]) {
        this.documentos = documentos;
    }

    setProcessoEnviado(recibo: ReciboModel): void {
        this.processoEnviado = true;
        this.recibo = recibo;
        this.messageService.showSuccessMsg('Pedido enviado com sucesso.');
    }

    tipoDeficienciaModelSelecionado(tipoDeficiencia: TipoDeficiencia) {
        this.tipoDeficienciaModel = tipoDeficiencia;
    }

    estadoCivilModelSelecionado(estadoCivil: EstadoCivil) {
        this.estadoCivilModel = estadoCivil;
    }

    beneficiarioModelSelecionado(beneficiarioModel: Beneficiario) {
        this.beneficiarioModel = beneficiarioModel;
    }

    selectMunicipio(municipio: Municipio): void {
        this.municipio = municipio;
    }

    selectUf(uf: DadoComboDTO): void {
        this.uf = uf;
    }
}
