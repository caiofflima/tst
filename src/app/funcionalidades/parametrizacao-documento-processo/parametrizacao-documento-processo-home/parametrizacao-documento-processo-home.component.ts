import {Component, OnInit} from '@angular/core';
import {take} from "rxjs/operators";
import {Router} from "@angular/router";
import {Location} from "@angular/common";
import {SelectItem} from "primeng/api";
import {FormBuilder} from "@angular/forms";
import {DadoComboDTO} from "../../../shared/models/dto/dado-combo";
import {BaseComponent} from "../../../shared/components/base.component";
import {ComboService} from "../../../shared/services/comum/combo.service";
import {MessageService} from "../../../shared/components/messages/message.service";
import {Data} from "../../../shared/providers/data";

@Component({
    selector: 'asc-parametrizacao-documento-processo-home',
    templateUrl: './parametrizacao-documento-processo-home.component.html',
    styleUrls: ['./parametrizacao-documento-processo-home.component.scss']
})
export class ParametrizacaoDocumentoProcessoHomeComponent extends BaseComponent implements OnInit {

    sexos: SelectItem[];
    listComboEtadoCivil: DadoComboDTO[];
    listComboMotivoDeSolicitacao: DadoComboDTO[];
    listComboTipoProcesso: DadoComboDTO[];
    listComboTipoDocumento: DadoComboDTO[];
    listComboTipoBeneficiario: DadoComboDTO[];

    formulario:any = this.formBuilder.group({
        sexo: [null],
        documentos: [null],
        obrigatorio: [null],
        estadoCivil: [null],
        somenteAtivos: [null],
        tiposProcesso: [null],
        tiposBeneficiario: [null],
        motivosDeSolicitacao: [null]
    });

    constructor(
        private readonly router: Router,
        private readonly location: Location,
        override readonly messageService: MessageService,
        private readonly formBuilder: FormBuilder,
        private readonly comboService: ComboService,
        private readonly data: Data
    ) {
        super(messageService);
    }

    public inicializarCombos(): void {
        this.comboService.consultarComboTipoBeneficiario().pipe(
            take<DadoComboDTO[]>(1)
        ).subscribe(res => this.listComboTipoBeneficiario = res, err => this.showDangerMsg(err.error));

        this.comboService.consultarComboTipoProcesso().pipe(
            take<DadoComboDTO[]>(1)
        ).subscribe(res => this.listComboTipoProcesso = res, err => this.showDangerMsg(err.error));

        this.comboService.consultarComboDocumento().pipe(
            take<DadoComboDTO[]>(1)
        ).subscribe(res => this.listComboTipoDocumento = res, err => this.showDangerMsg(err.error));

        this.comboService.consultarComboEstadoCivil().pipe(
            take<DadoComboDTO[]>(1)
        ).subscribe(res => this.listComboEtadoCivil = res, err => this.showDangerMsg(err.error));
        
        this.comboService.consultarComboFinalidade().pipe(
            take<DadoComboDTO[]>(1)
        ).subscribe(res => this.listComboMotivoDeSolicitacao = res, err => this.showDangerMsg(err.error));
    }

    private isStorageCarregado(): boolean {
        return ((this.data.storage) && (this.data.storage.filtroDocumentoProcesso));
    }

    ngOnInit() {
        this.getSexo();
        this.inicializarCombos();
        this.preencherCamposSelecionados();
        this.data.storage = {}; 
    }

    private preencherCamposSelecionados(): void {
        if (this.isStorageCarregado()) {
            const filtro = this.data.storage.filtroDocumentoProcesso;
            setTimeout(() => {
                this.formulario.patchValue({
                    obrigatorio: filtro.obrigatorio,
                    somenteAtivos: filtro.somenteAtivos
                });
            }, 50);

            this.preencherCamposSelecionadosPorCampo(filtro, "sexo");

            this.preencherCamposSelecionadosPorCampo(filtro, "documentos");

            this.preencherCamposSelecionadosPorCampo(filtro, "estadoCivil");

            this.preencherCamposSelecionadosPorCampo(filtro, "tiposProcesso");

            this.preencherCamposSelecionadosPorCampo(filtro, "tiposBeneficiario");

            this.preencherCamposSelecionadosPorCampo(filtro, "motivosDeSolicitacao");
        }
    }

    private preencherCamposSelecionadosPorCampo(filtro:any, nomeCampo:any):void{
        const lista = filtro[nomeCampo];
        if(!lista){
            return;
        }
        const valores = lista.map(v => typeof v === 'object' ? v.value : v);

        setTimeout(() => {  this.formulario.get(nomeCampo)?.setValue(valores);}, 200);
    }

    public novoPrazo(): void {
        this.router.navigateByUrl('/manutencao/parametros/documento-pedido/novo');
    }

    public getSexo(): void {
        this.sexos = [{
            value: 'M',
            label: "Masculino"
        }, {
            value: 'F',
            label: "Feminino"
        }];
    }

    public pesquisar(): void {
        this.data.storage = {};
        const dadosCompletos = this.prepararDadosCompletos();
        this.salvarStorage(dadosCompletos);
        this.navegarComFiltros(dadosCompletos);
    }
    
    private prepararDadosCompletos() {
        return {
            sexo: this.completarItens('sexo', this.sexos),
            documentos: this.completarItens('documentos', this.listComboTipoDocumento),
            estadoCivil: this.completarItens('estadoCivil', this.listComboEtadoCivil),
            tiposProcesso: this.completarItens('tiposProcesso', this.listComboTipoProcesso),
            tiposBeneficiario: this.completarItens('tiposBeneficiario', this.listComboTipoBeneficiario),
            motivosDeSolicitacao: this.completarItens('motivosDeSolicitacao', this.listComboMotivoDeSolicitacao)
        };
    }
    
    private completarItens(campo: string, lista: any[]): any[] | null {
        const valores = this.formulario.get(campo).value;
        if (!valores?.length) return null;
    
        return valores.map(val => this.montarItem(val, lista));
    }
    
    private montarItem(valor: any, lista: any[]): any {
        const numVal = typeof valor === 'object' ? valor.value : valor;
        const item = lista?.find(i => this.compararValores(i.value, numVal));
        
        return item 
            ? { label: item.label || item.descricao, value: item.value }
            : { label: '', value: numVal };
    }
    
    private compararValores(val1: any, val2: any): boolean {
        return Number(val1) === Number(val2);
    }
    
    private salvarStorage(dados: any): void {
        this.data.storage = {
            filtroDocumentoProcesso: {
                ...this.formulario.value,
                ...dados
            }
        };
    }
    
    private navegarComFiltros(dados: any): void {
        this.router.navigate(['/manutencao/parametros/documento-pedido/buscar'], {
            queryParams: this.construirQueryParams(dados)
        });
    }
    
    private construirQueryParams(dados: any): any {
        return {
            ...this.extrairValores(dados),
            ...this.extrairDescricoes(dados),
            obrigatorio: this.getValorOuNull('obrigatorio'),
            somenteAtivos: this.getValorOuNull('somenteAtivos')
        };
    }
    
    private extrairValores(dados: any): any {
        return {
            sexo: this.joinValores(dados.sexo),
            documentos: this.joinValores(dados.documentos),
            estadoCivil: this.joinValores(dados.estadoCivil),
            tiposProcesso: this.joinValores(dados.tiposProcesso),
            tiposBeneficiario: this.joinValores(dados.tiposBeneficiario),
            motivosDeSolicitacao: this.joinValores(dados.motivosDeSolicitacao)
        };
    }
    
    private extrairDescricoes(dados: any): any {
        return {
            descricaoSexo: this.joinLabels(dados.sexo),
            descricaoDocumentos: this.joinLabels(dados.documentos),
            descricaoEstadoCivil: this.joinLabels(dados.estadoCivil),
            descricaoTiposProcesso: this.joinLabels(dados.tiposProcesso),
            descricaoTiposBeneficiario: this.joinLabels(dados.tiposBeneficiario),
            descricaoMotivosDeSolicitacao: this.joinLabels(dados.motivosDeSolicitacao)
        };
    }
    
    private joinValores(items: any[]): string | null {
        return items ? items.map(i => i.value).join(',') : null;
    }
    
    private joinLabels(items: any[]): string | null {
        return items ? items.map(i => i.label).join(', ') : null;
    }
    
    private getValorOuNull(campo: string): any {
        const valor = this.formulario.get(campo).value;
        return valor !== null ? valor : null;
    }

    public limparCampos(): void {
        this.data.storage = null;
        this.formulario.reset();
        this.formulario.markAsPristine();
        this.formulario.markAsUntouched();
        this.formulario.updateValueAndValidity();
    }

    public voltar(): void {
        this.location.back();
    }

}
