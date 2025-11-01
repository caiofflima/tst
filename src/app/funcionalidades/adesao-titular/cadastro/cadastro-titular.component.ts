import { Component } from '@angular/core';
import { Subject, Subscription, take} from "rxjs";
import { BaseComponent } from 'app/shared/components/base.component';
import { DocumentoTipoProcesso } from 'app/shared/models/entidades';
import { ReciboModel } from 'app/funcionalidades/dependente/models/recibo-form.model';
import { DadoComboDTO } from 'app/shared/models/dtos';
import { TipoDeficiencia } from 'app/shared/models/entidades';
import { TipoDependente } from 'app/shared/models/comum/tipo-dependente';
import { DadosDependenteFormModel } from 'app/funcionalidades/dependente/models/dados-dependente-form.model';
import { BeneficiarioDependenteFormModel } from 'app/funcionalidades/dependente/models/beneficiario-dependente-form.model';
import { ComplementoDependenteFormModel } from 'app/funcionalidades/dependente/models/complemento-dependente.form.model';
import { DocumentoParam } from 'app/shared/components/asc-pedido/models/documento.param';
import { NumberUtil } from 'app/shared/util/number-util';
import { Beneficiario, EstadoCivil, Municipio, TipoProcesso } from 'app/shared/models/entidades';
import { Atendimento } from "app/shared/models/comum/atendimento";
import {AtendimentoService} from "app/shared/services/comum/atendimento.service";
import { DocumentoTipoProcessoService, MessageService } from 'app/shared/services/services';
import { SessaoService } from 'app/shared/services/services';
import { ContatoEnderecoFormModel } from '../models/contato-endereco-form-model';

@Component({
    selector: 'asc-cadastro-titular',
    templateUrl: './cadastro-titular.component.html',
    styleUrls: ['./cadastro-titular.component.scss']
})
export class CadastroTitularComponent extends BaseComponent {
    
    readonly idTipoProcesso = 15; //Adesão

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
    tipoDependenteModel: TipoDependente;
   
    beneficiarioModel?: Beneficiario;
    estadoCivilModel:any
    tipoProcesso: TipoProcesso;
    parametroDocumento: DocumentoParam = {};
    breadcrumb: Array<string> = [ "Novo Pedido", "Beneficiário ", "Inscrição de Adesão" ];
    versao = 0;
    matricula: string;
    contatoEnderecoModel?: ContatoEnderecoFormModel;

    private atendimentoSubject: Subscription;

    constructor(
        messageService: MessageService, 
        private documentoTipoProcessoService: DocumentoTipoProcessoService,
        readonly sessaoService: SessaoService,
        private readonly atendimentoService: AtendimentoService
        ) {
        super(messageService);
        this.reinicarSubject.subscribe(() => {
            this.versao++
        });
    }

    ngOnInit(): void {
        this.carregarAtendimento();
    }

    carregarDocumentos() {
        this.documentoTipoProcessoService.consultarPorProcesso(this.idTipoProcesso, this.matricula).subscribe(documentos => {
          this.documentos = documentos;
          console.log(this.documentos);
         },
          (err) => {
            this.documentos = null;
          }
        );
      }

      contatoEnderecoModelSelecionado(contatoEnderecoModel: any) {
        this.contatoEnderecoModel = contatoEnderecoModel;
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
                    this.carregarDocumentos();
                }
            }, error => this.messageService.addMsgDanger(error.error));
        }
    }

    tipoDependenteModelSelecionado(tipoDependenteModel: TipoDependente) {
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
            this.parametroDocumento = {
                idTipoBeneficiario: this.beneficiarioDependenteModel.idTipoBeneficiario,
                idTipoProcesso: this.idTipoProcesso,
            };
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

    complementoDependenteModelSelecionado(complementoDependenteModel: any) {
        this.complementoDependenteModel = complementoDependenteModel;
        if (complementoDependenteModel) {
            this.parametroDocumento = {
                idTipoProcesso: this.idTipoProcesso,
                idTipoBeneficiario: this.beneficiarioDependenteModel.idTipoBeneficiario,
                sexo: this.beneficiarioDependenteModel.sexo.descricao,
                idEstadoCivil: this.beneficiarioDependenteModel.estadoCivil,
                idade: this.getAge(this.beneficiarioDependenteModel.dataNascimento),
                idTipoDeficiencia: this.tipoDeficienciaModel ? this.tipoDeficienciaModel.id : null,
                valorRenda: NumberUtil.convertStringToNumber(this.complementoDependenteModel.renda)
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

    tipoDeficienciaModelSelecionado(tipoDeficiencia: any) {
        this.tipoDeficienciaModel = tipoDeficiencia;
    }

 

    beneficiarioModelSelecionado(beneficiarioModel: Beneficiario) {
        this.beneficiarioModel = beneficiarioModel;
    }
    estadoCivilModelSelecionado(beneficiarioModel: any) {
        this.beneficiarioModel = beneficiarioModel;
    }

    selectMunicipio(municipio: any): void {
        this.municipio = municipio;
    }

    selectUf(uf: any): void {
        this.uf = uf;
    }
}
