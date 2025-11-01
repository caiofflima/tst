import {Component} from '@angular/core';
import {SolicitacaoFormModel} from '../models/solicitacao-form.model';
import {FinalidadeFormModel} from '../models/finalidade-form-model';
import {
    Beneficiario,
    GrauProcedimento,
    MotivoSolicitacao,
    Pedido,
    PedidoProcedimento,
    TipoProcesso,
} from '../../../../shared/models/entidades';
import {ProfissionalFormModel} from '../models/profissional-form.model';
import {DocumentoTipoProcesso} from '../../../../shared/models/dto/documento-tipo-processo';
import {DadoComboDTO} from '../../../../shared/models/dtos';
import {Municipio} from '../../../../shared/models/comum/municipio';
import {DocumentoParam} from "../../../../shared/components/asc-pedido/models/documento.param";
import {Subject} from "rxjs";

@Component({
    selector: 'app-autorizaca-previa-base',
    templateUrl: './autorizacao-previa-base.component.html',
    styleUrls: ['./autorizacao-previa-base.component.scss'],
})
export class AutorizacaoPreviaBaseComponent {
    solicitacao?: SolicitacaoFormModel;
    finalidade?: FinalidadeFormModel;
    procedimentos?: PedidoProcedimento[] = [];
    profissionalFormModel?: ProfissionalFormModel;
    beneficiarioModel?: Beneficiario;
    documentos: DocumentoTipoProcesso[];
    tipoProcesso: TipoProcesso;
    motivoSolicitacao: MotivoSolicitacao;
    ufEstadoConselho: DadoComboDTO;
    municipioProfissional: Municipio;
    conselhoProfissionalSelecionado: DadoComboDTO;
    pedido: Pedido;
    grauProcedimento: GrauProcedimento;
    pedidoProcedimentoVersao: number = 1;
    conselho: DadoComboDTO;
    parametroDocumento: DocumentoParam = {};
    reiniciarSubject: Subject<void> = new Subject<void>();

    breadcrumb: Array<string> = [
        "Novo Pedido ", "Autorização Prévia "
    ];

    pedidoProcedimentoChanged(): void {
        this.pedidoProcedimentoVersao++;
    }

    solicitacaoStep(solicitacao: SolicitacaoFormModel) {
        this.solicitacao = solicitacao;
    }

    beneficiarioSelecionado(beneficiario: FinalidadeFormModel) {
        this.finalidade = beneficiario;
    }

    pedidoProcedimentos(procedimentos: PedidoProcedimento[]) {
        this.procedimentos = procedimentos;
    }

    profissional(profissionalFormModel: ProfissionalFormModel) {
        this.profissionalFormModel = profissionalFormModel;
    }

    beneficiarioModelSelecionado(beneficiarioModel: Beneficiario) {
        this.beneficiarioModel = beneficiarioModel;
    }

    documentosCadastrado(documentos: DocumentoTipoProcesso[]) {
        this.documentos = documentos;
    }

    motivoSolicitacaoSelecionado(motivoSolicitacao: MotivoSolicitacao) {
        this.motivoSolicitacao = motivoSolicitacao;
    }

    tipoProcessoSelecionado(tipoProcesso: TipoProcesso) {
        if (this.beneficiarioModel && this.finalidade) {
            const { matricula, estadoCivil, idTipoDeficiencia, remuneracaoBase } = this.beneficiarioModel;
    
            this.parametroDocumento = {
                idTipoProcesso: tipoProcesso.id,
                idTipoBeneficiario: this.beneficiarioModel.tipoDependente.id,
                idMotivo: this.finalidade.idMotivoSolicitacao,
                sexo: matricula.sexo,
                idEstadoCivil: estadoCivil ? estadoCivil.id : null,
                idade: this.calcularIdade(new Date(matricula.dataNascimento)), 
                valorRenda: parseFloat(remuneracaoBase) || 0,
                idTipoDeficiencia: idTipoDeficiencia,
            };
        } else {
            this.parametroDocumento = {};
        }
    
        this.tipoProcesso = tipoProcesso;
    }
    
    
    calcularIdade(dataNascimento: Date): number {
        if (!dataNascimento) return null;
        const today = new Date();
        let age = today.getFullYear() - dataNascimento.getFullYear();
        const m = today.getMonth() - dataNascimento.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dataNascimento.getDate())) {
            age--;
        }
        return age;
    }

    ufEstadoConselhoSelecionado(ufEstadoConselho: DadoComboDTO) {
        this.ufEstadoConselho = ufEstadoConselho;
    }

    municipioProfissionalSelecionado(municipio: Municipio) {
        this.municipioProfissional = municipio;
    }

    conselhoSelecionado(conselho: DadoComboDTO) {
        this.conselhoProfissionalSelecionado = conselho;
    }

    pedidoModoRascunho(pedido: Pedido) {
        this.pedido = new Pedido({...pedido});
        console.log(pedido);
    }

    grauProcedimentoSelecionado(grauProcedimento: GrauProcedimento) {
        this.grauProcedimento = grauProcedimento;
    }
}
