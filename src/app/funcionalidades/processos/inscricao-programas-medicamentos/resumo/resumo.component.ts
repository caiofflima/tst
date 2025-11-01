import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {BeneficiarioForm} from "../../../../shared/components/asc-pedido/models/beneficiario.form";
import {DocumentoTipoProcesso} from "../../../../shared/models/dto/documento-tipo-processo";
import {ArquivoParam} from "../../../../shared/components/asc-file/models/arquivo.param";
import {BaseComponent} from "../../../../shared/components/base.component";
import {MessageService} from "../../../../shared/services/services";
import {InscricaoProgramasMedicamentosService} from "../../../../shared/services/comum/inscricao-programas-medicamento.service";
import {AscStepperComponent} from 'app/shared/components/asc-stepper/asc-stepper/asc-stepper.component';
import {Router} from '@angular/router';
import {ReciboModel} from '../models/reciboModel';
import {Patologia} from "../../../../shared/models/comum/patologia";
import { StringUtil } from 'app/shared/util/string-util';

@Component({
    selector: 'app-resumo-pmd',
    templateUrl: './resumo.component.html',
    styleUrls: ['./resumo.component.scss']
})
export class ResumoComponent extends BaseComponent {
   
    @Input() beneficiarioForm?: BeneficiarioForm;
    @Input() patologia?: Patologia;
    @Input() documentos: DocumentoTipoProcesso[];
    @Input() stepper: AscStepperComponent;
    @Output() beneficiarioCardForm = new EventEmitter<BeneficiarioForm>();
    @Output() reiniciarEvent = new EventEmitter<void>();
    @Output() processoEnviadoEvent = new EventEmitter<ReciboModel>();
    
    private _arquivoParam: ArquivoParam;
    private _documentoTipoProcessoDTO: DocumentoTipoProcesso;
    
    documentoNaoPossuiArquivos: boolean = false;
    infoAdicional: FormControl = new FormControl();
    isLoading: boolean = false;

    showModal: boolean = false;

    constructor(
        protected override messageService: MessageService,
        protected inscricaoProgMed: InscricaoProgramasMedicamentosService,
        private router: Router
    ) {
        super(messageService);
        this.messageService = messageService;
        this.router = router;
    }

    onSubmit(): void {
        this.isLoading = true;
        const formData = new FormData();
        let formInscricaoProgramaMed = {
            idBeneficiario: this.beneficiarioForm.idBeneficiario,
            idTipoBeneficiario: this.beneficiarioForm.idTipoBeneficiario,
            idTipoProcesso: 5,
            emailBeneficiario: this.beneficiarioForm.email,
            telefoneBeneficiario: this.beneficiarioForm.telefoneContato,
            idPatologia: this.patologia.id,
            noPatologia: this.patologia.nome,
            dsInfoAdicional: this.infoAdicional.value
        };

        let i = 0;
        this.documentos.forEach(file => {
            file.arquivos.forEach(f => {
                formData.append(`arquivo${i}`, f);
                formData.append(`nomeArquivo${i}`, btoa(f.name));
                formData.append(`idDocumentoTipoProcesso${i}`, String(file.id));
                i++;
            })
        });

        const jsonInscricaoProgramaMedString = JSON.stringify(formInscricaoProgramaMed);
            
        formData.append('data', StringUtil.utf8ToBase64(jsonInscricaoProgramaMedString));

        //formData.append('data', btoa(JSON.stringify(formInscricaoProgramaMed)));

        this.inscricaoProgMed.salvar(formData).subscribe(res => {
                this.isLoading = false;
                this.processoEnviadoEvent.emit(res);
            }, error => {
                this.messageService.addMsgDanger(error.error);
                this.isLoading = false;
            }
        );
    }

    arquivosSelecionados(arquivoParam: ArquivoParam) {
        this._arquivoParam = arquivoParam;
    }

    documentoTipoProcessoSelecionado(documentoTipoProcessoDTO: DocumentoTipoProcesso) {
        this._documentoTipoProcessoDTO = documentoTipoProcessoDTO;
    }

    previousStep(_: MouseEvent) {
        this.stepper.previous();
    }

    possuiFaltaDeArquivos(value: boolean) {
        this.documentoNaoPossuiArquivos = value;
    }

    updateBeneficiario(beneficiarioParam: BeneficiarioForm) {
        this.beneficiarioCardForm.emit(beneficiarioParam);
    }

    reiniciarForm(): void {
        this.stepper.reset();
        this.reiniciarEvent.emit();
        this.showModal = false;
    }

    setModal(bool: boolean): void {
        this.showModal = bool;
    }

}
