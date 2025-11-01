import {Component} from '@angular/core';
import {MessageService} from "app/shared/components/messages/message.service";
import {BaseComponent} from "app/shared/components/base.component";
import {DocumentoTipoProcesso} from "../../../../shared/models/dto/documento-tipo-processo";
import {Subject} from 'rxjs';
import {ReciboModel} from '../../models/recibo-form.model';
import {Beneficiario, MotivoSolicitacao} from "../../../../shared/models/entidades";
import {DocumentoParam} from '../../../../shared/components/asc-pedido/models/documento.param';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'cancelar-dependente',
    templateUrl: './cancelar-dependente.component.html',
    styleUrls: ['./cancelar-dependente.component.scss']
})
export class CancelarDependenteComponent extends BaseComponent {
    readonly idTipoProcesso = 12;
    parametro: DocumentoParam = {};

    documentos: DocumentoTipoProcesso[] = [];
    reinicarSubject: Subject<void> = new Subject<void>();
    processoEnviado: boolean = false;

    recibo: ReciboModel;
    beneficiarioModel?: Beneficiario;
    motivoCancelamentoModel?: MotivoSolicitacao;
    dataOcorrenciaModel?: Date;
    idBeneficiarioModel = null;

    breadcrumb: Array<string> = [
        "Novo Pedido ", "Beneficiário ", "Cancelamento de Dependente "
    ];

    constructor(protected override messageService: MessageService,
                protected route: ActivatedRoute) {
        super(messageService);
        this.idBeneficiarioModel = this.route.snapshot.params['idBeneficiario'];
    }

    beneficiarioModelSelecionado(beneficiarioModel: Beneficiario) {
        this.beneficiarioModel = beneficiarioModel;
        this.atualizarParametro();
    }

    documentosSelecionados(documentos: DocumentoTipoProcesso[]) {
        this.documentos = documentos;
    }

    reiniciarWatcher(): void {
        this.reinicarSubject.next()
    };

    setProcessoEnviado(recibo: ReciboModel): void {
        this.processoEnviado = true;
        this.recibo = recibo;
        this.messageService.showSuccessMsg('Pedido enviado com sucesso.');
    }

    motivoCancelamentoModelSelecionado(motivoCancelamento: MotivoSolicitacao) {
        this.motivoCancelamentoModel = motivoCancelamento;
        this.atualizarParametro();
    }
    
    atualizarParametro() {
        if (this.beneficiarioModel && this.motivoCancelamentoModel) {
            const { matricula, estadoCivil, idTipoDeficiencia, remuneracaoBase } = this.beneficiarioModel;
    
            this.parametro = {
                idTipoProcesso: this.idTipoProcesso,
                idTipoBeneficiario: this.beneficiarioModel.tipoDependente.id,
                idMotivo: this.motivoCancelamentoModel.id,
                sexo: matricula ? matricula.sexo : null,
                idEstadoCivil: estadoCivil ? estadoCivil.id : null,
                idade: matricula && matricula.dataNascimento ? this.calcularIdade(new Date(matricula.dataNascimento)) : null,
                valorRenda: remuneracaoBase ? parseFloat(remuneracaoBase) : 0,
                idTipoDeficiencia: idTipoDeficiencia,
                //idCaraterSolicitacao: this.documentos[0].idCaraterSolicitacao ? this.documentos[0].idCaraterSolicitacao: null,
            };
        } else {
            this.parametro = null;
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
    

    dataOcorrenciaModelSelecionada(dataOcorrenciaSelecionada: Date){
        this.dataOcorrenciaModel = dataOcorrenciaSelecionada;
    }
}
