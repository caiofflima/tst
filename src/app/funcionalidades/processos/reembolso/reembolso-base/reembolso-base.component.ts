import {Component, OnDestroy} from '@angular/core';
import {Router} from "@angular/router";
import {FinalidadeFormModel} from "../../../../shared/components/asc-pedido/models/finalidade-form-model";
import {TipoBuscaProcesso} from "../../../../shared/models/tipo-busca-processo";
import {
    AscSelectComponentProcedimentosParams
} from "../../../../shared/components/asc-select/models/asc-select-component-procedimentos.params";
import {
    Beneficiario,
    GrauProcedimento,
    Municipio,
    Pedido,
    PedidoProcedimento,
    Procedimento,
    TipoProcesso
} from "../../../../shared/models/entidades";
import {DadoComboDTO} from "../../../../shared/models/dtos";
import {ProfissionalFormModel} from "../../../../shared/components/asc-pedido/models/profissional-form.model";
import {DocumentoTipoProcesso} from "../../../../shared/models/dto/documento-tipo-processo";
import {BeneficiarioForm} from "../../../../shared/components/asc-pedido/models/beneficiario.form";
import {DocumentoFiscal} from "../models/documento-fiscal.model";
import {Subject} from "rxjs";
import {fadeAnimation} from "../../../../shared/animations/faded.animation";
import {TipoProcessoEnum} from "../../../../shared/components/asc-pedido/models/tipo-processo.enum";
import {DocumentoParam} from "../../../../shared/components/asc-pedido/models/documento.param";
import {MedicamentoPatologiaPedidoService} from "../../../../shared/services/comum/medicamento-patologia-pedido.service";
import {MessageService} from 'app/shared/components/messages/message.service';

@Component({
    selector: 'asc-reembolso-base',
    templateUrl: './reembolso-base.component.html',
    styleUrls: ['./reembolso-base.component.scss'],
    animations: [...fadeAnimation]
})
export class ReembolsoBaseComponent implements OnDestroy {

    REEMBOLSO = TipoBuscaProcesso.CONSULTAR_REEMBOLSO;
    parametroSelectProcedimento: AscSelectComponentProcedimentosParams;

    tipoProcesso: TipoProcesso;
    finalidade: FinalidadeFormModel;
    grauProcedimento: GrauProcedimento;
    regiaoOdontologica: GrauProcedimento;
    procedimento: Procedimento;
    beneficiarioModel: Beneficiario;
    pedido: Pedido;
    parametroDocumento: DocumentoParam = {};
    pedidoProcedimentos: PedidoProcedimento[] = [];
    pedidoProcedimentoVersao: number = 1;
    reiniciarSubject: Subject<void> = new Subject<void>();

    conselho: DadoComboDTO;
    municipioProfissional: Municipio;
    profissional: ProfissionalFormModel;
    ufConselho: DadoComboDTO;

    documentoFiscal: DocumentoFiscal;
    documentos: DocumentoTipoProcesso[];
    beneficiarioForm: BeneficiarioForm;
    titulo: string;

    private readonly subjectUnsubscribe$ = new Subject<void>();

    showStepProfissional = true;

    breadcrumb: Array<string> = [
        "Novo Pedido ", "Reembolso "
    ];

    constructor(private readonly router: Router,
        protected readonly medicamentoPatologiaPedidoService: MedicamentoPatologiaPedidoService,
        protected messageService: MessageService) {
        this.router = router;
    }

    ngOnDestroy(): void {
        this.subjectUnsubscribe$.next();
        this.subjectUnsubscribe$.complete();
    }

    pedidoProcedimentoChanged(): void {
        this.pedidoProcedimentoVersao++;
    }

    finalidadeSelecionada(finalidade: FinalidadeFormModel) {
        this.finalidade = finalidade;
    }

    beneficiarioSelecionado(beneficiario: Beneficiario) {
        this.beneficiarioModel = beneficiario
    }

    tipoProcessoSelecionado(tipoProcesso: TipoProcesso) {
        this.tipoProcesso = tipoProcesso;
        this.parametroSelectProcedimento = {
            idTipoProcesso: tipoProcesso.id
        };
    
        this.showStepProfissional = tipoProcesso.id !== TipoProcessoEnum.REEMBOLSO_MEDICAMENTO && tipoProcesso.id !== TipoProcessoEnum.REEMBOLSO_VACINA;
        this.titulo = this.showStepProfissional ? "OK. Agora, precisamos dos dados dos procedimentos." : "Ok. Agora, precisamos dos dados do medicamento/vacina.";
    
        if (this.beneficiarioModel && this.finalidade) {
            
            const dataNascimento = new Date(this.beneficiarioModel.matricula.dataNascimento);
    
            this.parametroDocumento = {
                idTipoProcesso: this.tipoProcesso.id,
                idTipoBeneficiario: this.beneficiarioModel.tipoDependente.id,
                idMotivo: this.finalidade.idMotivoSolicitacao,
                sexo: this.beneficiarioModel.matricula.sexo,
                idEstadoCivil: this.beneficiarioModel.estadoCivil ? this.beneficiarioModel.estadoCivil.id : null,
                idade: this.calcularIdade(dataNascimento),
                valorRenda: parseFloat(this.beneficiarioModel.remuneracaoBase) || 0,
                idTipoDeficiencia: this.beneficiarioModel.idTipoDeficiencia,
                //idCaraterSolicitacao: this.documentos[0].idCaraterSolicitacao ? this.documentos[0].idCaraterSolicitacao: null,
            };
        }
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

    pedidoCadastrado(pedido: Pedido) {
        this.pedido = pedido;
    }

    ifTipoMedicamento(): boolean{
        return(this.tipoProcesso.id === TipoProcessoEnum.REEMBOLSO_MEDICAMENTO);
    }

    pedidoProcedimentosSelecionados(pedidoProcedimentos: PedidoProcedimento[]): void {
    
        if(this.ifTipoMedicamento()){
            this.pedidoProcedimentosSelecionadosMedicamento(pedidoProcedimentos);
        }else{
            
            this.pedidoProcedimentos = pedidoProcedimentos;
        }
    }

    pedidoProcedimentosSelecionadosMedicamento(pedidoProcedimentos: PedidoProcedimento[]): void {
        //console.log("[ANTES]->RESUMO BASE pedidoProcedimentosSelecionados(pedidoProcedimentos: PedidoProcedimento[]): void { --> ");
        //console.log(pedidoProcedimentos);
        if(pedidoProcedimentos && pedidoProcedimentos.length>0 
            && pedidoProcedimentos[0].medicamentoPatologia !==undefined 
            && pedidoProcedimentos[0].medicamentoPatologia !==null){
                //console.log("[TEM medicamentoPatologia]->RESUMO BASE pedidoProcedimentosSelecionados(");
                this.pedidoProcedimentos = pedidoProcedimentos;
        }else{
            //console.log("[DEPOIS]->pedidoProcedimentosSelecionados(pedidoProcedimentos: PedidoProcedimento[]): void { --> ");
            //console.log("pedidoProcedimentos[0].idPedido = " + pedidoProcedimentos[0].idPedido);
            if(pedidoProcedimentos && pedidoProcedimentos.length>0 
                && pedidoProcedimentos[0].idPedido !==undefined && pedidoProcedimentos[0].idPedido !==null){
                //console.log("[PASSOU] pedidoProcedimentos[0].idPedido = " + pedidoProcedimentos[0].idPedido);
                this.consultarMedicamentos(pedidoProcedimentos[0].idPedido);
            }
        }
        //console.log(pedidoProcedimentos);
        //console.log("[FIM] pedidoProcedimentos [FIM]");
    }

    consultarMedicamentos(idPedido: number) {
        if(idPedido!==undefined && idPedido!==null){
            this.medicamentoPatologiaPedidoService.consultarPorIdPedido(idPedido).subscribe(res => {
                    //console.log(res);
                    this.pedidoProcedimentos = res;
                    //console.log(" consultarMedicamentos(idPedido: number) { -> DEPOIS consultarMedicamentos(idPedido: number) {");
                    //console.log(this.pedidoProcedimentos);
                }, error => {
                    this.messageService.addMsgDanger(error.error);
                }
            );
        }
    }

    grauProcedimentoSelecionado(grauProcedimento: GrauProcedimento): void {
        this.grauProcedimento = grauProcedimento;
    }

    regiaoOdontologicaSelecionada(regiaoOdontologica: GrauProcedimento): void {
        this.regiaoOdontologica = regiaoOdontologica;
    }

    conselhoProfissionalSelecionado(conselho: DadoComboDTO): void {
        this.conselho = conselho;
    }

    municipioProfissionalSelecionado(municipio: Municipio): void {
        this.municipioProfissional = municipio;
    }

    profissionalSelecionado(profissionalFormModel: ProfissionalFormModel): void {
        this.profissional = profissionalFormModel;
    }

    ufEstadoConselhoSelecionado(ufConselho: DadoComboDTO) {
        this.ufConselho = ufConselho;
    }

    documentoFiscalSelecionado(documentoFiscal: DocumentoFiscal) {
        const numeroConselho = Number.isNaN(Number(documentoFiscal.numeroDoc)) ? documentoFiscal.numeroDoc : Number(documentoFiscal.numeroDoc)
        this.documentoFiscal = documentoFiscal;

        this.profissional = {
            ...this.profissional,
            cpfCnpj: documentoFiscal.cpfCnpj,
            nomeProfissional: documentoFiscal.nome,
            idEstadoConselho: documentoFiscal.idEstado,
            idMunicipioProfissional: documentoFiscal.idMunicipio,
        }
    }

    documentosSelecionados(documentos: DocumentoTipoProcesso[]) {
        this.documentos = documentos;
    }

    beneficiarioFormSelecionado(beneficiarioForm: BeneficiarioForm) {
        this.beneficiarioForm = beneficiarioForm;
    }
}
