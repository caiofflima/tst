import {Component} from '@angular/core';
import {MessageService} from "../../../../shared/components/messages/message.service";
import {BaseComponent} from "../../../../shared/components/base.component";
import {DocumentoTipoProcesso} from "../../../../shared/models/dto/documento-tipo-processo";
import {Subject} from 'rxjs';
import {ReciboModel} from '../../models/recibo-form.model';
import {Beneficiario, EstadoCivil, MotivoSolicitacao} from "../../../../shared/models/entidades";
import {Municipio} from '../../../../shared/models/comum/municipio';
import {DadoComboDTO} from '../../../../shared/models/dto/dado-combo';
import {TipoDeficiencia} from '../../../../shared/models/comum/tipo-deficiencia';
import {TipoDependente} from '../../../../shared/models/comum/tipo-dependente'
import {DadosDependenteFormModel} from "../../models/dados-dependente-form.model";
import {BeneficiarioDependenteFormModel} from "../../models/beneficiario-dependente-form.model";
import {ComplementoDependenteFormModel} from "../../models/complemento-dependente.form.model"
import {DocumentoParam} from "../../../../shared/components/asc-pedido/models/documento.param";
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'asc-alterar-dependente',
    templateUrl: './alterar-dependente.component.html',
    styleUrls: ['./alterar-dependente.component.scss']
})
export class AlterarDependenteComponent extends BaseComponent {
    readonly idTipoProcesso = 13;

    documentos: DocumentoTipoProcesso[] = [];
    reiniciarSubject: Subject<void> = new Subject<void>();
    processoEnviado: boolean = false;
    recibo: ReciboModel;
    beneficiarioDependenteModel?: BeneficiarioDependenteFormModel;
    dadoDependenteModel?: DadosDependenteFormModel;
    complementoDependenteModel?: ComplementoDependenteFormModel;
    estado: DadoComboDTO;
    municipioModel: Municipio;
    tipoDeficienciaModel: TipoDeficiencia;
    tipoDependenteModel: any;
    estadoCivilModel: EstadoCivil;
    motivoSolicitacaoModel?: MotivoSolicitacao;
    beneficiarioModel?: Beneficiario;
    parametroDocumento: DocumentoParam = {};
    idBeneficiarioModel: number = null;

    breadcrumb: Array<string> = [
        "Novo Pedido ", "Beneficiário ", "Atualização de Beneficiário "
    ];

    constructor(
        protected override messageService: MessageService,
        protected route: ActivatedRoute) {
        super(messageService);
        this.idBeneficiarioModel = this.route.snapshot.params['idBeneficiario'];
    }

    tipoDependenteModelSelecionado(tipoDependenteModel: TipoDependente) {
        this.tipoDependenteModel = tipoDependenteModel;
        if (this.tipoDependenteModel) {
            this.parametroDocumento.idTipoBeneficiario = tipoDependenteModel.id;
            this.parametroDocumento = {...this.parametroDocumento};
        } else {
            this.parametroDocumento.idTipoBeneficiario = null;
        }
    }

    getIdBeneficiario() {
        this.idBeneficiarioModel = this.route.snapshot.params['idBeneficiario'];
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

    beneficiarioDependenteModelSelecionado(beneficiarioDependenteModel: BeneficiarioDependenteFormModel) {
        this.beneficiarioDependenteModel = beneficiarioDependenteModel;
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
                idMotivo: this.beneficiarioDependenteModel.idMotivoSolicitacao,
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

    municipioSelecionado(municipio: Municipio) {
        this.municipioModel = municipio;
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

    motivoSolicitacaoModelSelecionado(motivoSolicitacao: MotivoSolicitacao) {
        this.motivoSolicitacaoModel = motivoSolicitacao;
    }
}
