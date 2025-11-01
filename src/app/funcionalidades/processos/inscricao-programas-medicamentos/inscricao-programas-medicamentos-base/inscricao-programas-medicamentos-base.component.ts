import { Component } from '@angular/core';
import { MessageService } from 'app/shared/components/messages/message.service';
import { BaseComponent } from 'app/shared/components/base.component';
import { BeneficiarioForm } from 'app/shared/components/asc-pedido/models/beneficiario.form';
import { Beneficiario } from 'app/shared/models/entidades';
import { DocumentoTipoProcesso } from 'app/shared/models/dto/documento-tipo-processo';
import { Subject } from 'rxjs';
import { ReciboModel } from '../models/reciboModel';
import { Patologia } from 'app/shared/models/comum/patologia';
import { DocumentoParam } from 'app/shared/components/asc-pedido/models/documento.param';
import { BeneficiarioService } from 'app/shared/services/services';

@Component({
    selector: 'app-inscricao-programas-medicamentos-base',
    templateUrl: './inscricao-programas-medicamentos-base.component.html',
    styleUrls: ['./inscricao-programas-medicamentos-base.component.scss'],
})

export class InscricaoProgramasMendicamentosBaseComponent extends BaseComponent {
    readonly idTipoProcesso = 5;

    beneficiarioForm?: BeneficiarioForm;
    beneficiario?: Beneficiario;
    patologia?: Patologia;
    documentos: DocumentoTipoProcesso[] = [];
    reiniciarSubject: Subject<void> = new Subject<void>();
    processoEnviado: boolean = false;
    recibo: ReciboModel;
    parametrosDocumento: DocumentoParam = {};

    breadcrumb: Array<string> = [
        "Novo Pedido ", "Inscrição no Programas de Medicamentos "
    ];

    constructor(
        protected override messageService: MessageService,
        private beneficiarioService: BeneficiarioService
    ) {
        super(messageService);
    }

    patologiaSelecionada(patologia: Patologia) {
        this.patologia = patologia;
    }

    beneficiarioFormSelecionado(beneficiarioForm: BeneficiarioForm) {
        this.beneficiarioForm = beneficiarioForm;
        if (this.beneficiarioForm && this.beneficiarioForm.idBeneficiario) {
            this.beneficiarioService.consultarBeneficiarioPorId(this.beneficiarioForm.idBeneficiario).subscribe(
                (data: Beneficiario) => {
                    this.beneficiario = data;
                    const dataNascimento = new Date(this.beneficiario.dtNascimento);

                    this.parametrosDocumento = {
                        idTipoProcesso: this.idTipoProcesso,
                        idTipoBeneficiario: this.beneficiarioForm.idTipoBeneficiario,
                        idPedido: null,
                        sexo: this.beneficiario.sexo,
                        idEstadoCivil: this.beneficiario.estadoCivil ? this.beneficiario.estadoCivil.id : null,
                        idade: this.calcularIdade(dataNascimento),
                        valorRenda: parseFloat(this.beneficiario.remuneracaoBase) || 0,
                        idTipoDeficiencia: this.beneficiario.idTipoDeficiencia,
                        //idCaraterSolicitacao: this.documentos[0].idCaraterSolicitacao ? this.documentos[0].idCaraterSolicitacao: null,
                    };
                },
                error => {
                    this.messageService.addMsgDanger('Falha ao buscar informacoes do beneficiário');
                }
            );
        } else {
            this.parametrosDocumento = null;
        }
    }

    beneficiarioFormSelecionadoEdit(beneficiarioForm: BeneficiarioForm) {
        const {email, telefoneContato} = beneficiarioForm;
        this.beneficiarioForm = {...this.beneficiarioForm, email, telefoneContato};
    }

    documentosSelecionados(documentos: DocumentoTipoProcesso[]) {
        this.documentos = documentos;
    }

    setProcessoEnviado(recibo: ReciboModel): void {
        this.processoEnviado = true;
        this.recibo = recibo;
        this.recibo.nomeBeneficiario = this.beneficiarioForm.nome;
        this.messageService.showSuccessMsg('Pedido enviado com sucesso.');
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
}
