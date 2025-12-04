import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FormControl} from "@angular/forms";
import {Location} from "@angular/common";

import {TipoDocumentoService} from "../../../shared/services/comum/tipo-documento.service";
import {BaseComponent} from "../../../shared/components/base.component";
import {MessageService} from "../../../shared/components/messages/message.service";
import {FiltroConsultaDocumento} from "../../../shared/models/filtro/filtro-consulta-documento";
import {Option} from 'sidsc-components/dsc-select';

@Component({
    selector: 'asc-parametrizacao-documentos-home',
    templateUrl: './parametrizacao-documentos-home.component.html',
    styleUrls: ['./parametrizacao-documentos-home.component.scss']
})
export class ParametrizacaoDocumentosHomeComponent extends BaseComponent implements OnInit {
    tipoDocumentoOption: Option[] = [];
    filtro: FiltroConsultaDocumento = new FiltroConsultaDocumento();
    idTipoDocumento = new FormControl(null);
    documento: string;
    idTipoDocumentoSelecionado: any;
    selectedOption: Option;
    selectedValue:any;

    constructor(
        override readonly messageService: MessageService,
        private readonly service: TipoDocumentoService,
        private readonly route: Router,
        private readonly location: Location
    ) {
        super(messageService)
    }

    ngOnInit(): void {
        this.getTipoDocumento();
    }

    private getTipoDocumento(): void {

        this.service.consultarTodos().subscribe(result => {

            this.tipoDocumentoOption = result.map(item => ({
                label: item.nome,
                value: item
            }));

            this.iniciarCamposPreenchidos();
        });
    }

    private iniciarCamposPreenchidos():void{ 
        let documentoStorage = this.getDocumentoStorage();

        if(documentoStorage){
            if(documentoStorage.documento  && this.tipoDocumentoOption && this.tipoDocumentoOption.length>0){
                this.selectedOption = this.tipoDocumentoOption.find(item=>item.label === documentoStorage.documento) ;
                this.selectedValue = this.selectedOption.value;
                this.documento = documentoStorage.documento;
                this.idTipoDocumentoSelecionado = documentoStorage.idTipoDocumento;
            }

            if(documentoStorage.ativo)
                this.filtro.ativo = documentoStorage.ativo;

            if(documentoStorage.link)
                this.filtro.link = documentoStorage.link;

            if(documentoStorage.nome)
                this.filtro.nome = documentoStorage.nome;

            if(documentoStorage.opme)
                this.filtro.opme = documentoStorage.opme;
        }
    }

    private getDocumentoStorage():any{
        if(localStorage.getItem('documentoStorage')){
            return JSON.parse(localStorage.getItem('documentoStorage'));
        }
        return null;
    }

    pesquisar(): void {

        let documentoStorage = {
            documento: this.documento || '',
            //idTipoDocumento: this.idTipoDocumento.value ? this.idTipoDocumento.value.id : '',
            idTipoDocumento: this.idTipoDocumentoSelecionado ?? '', 
            nome: this.filtro.nome || '',
            opme: this.filtro.opme ?? '',
            ativo: this.filtro.ativo ?? '',
            link: this.filtro.link ?? ''
        }

        localStorage.setItem('documentoStorage', JSON.stringify(documentoStorage));

        this.route.navigate(['manutencao/parametros/documentos/buscar'], {
            queryParams: {
                documento: this.documento || '',
                //idTipoDocumento: this.idTipoDocumento.value ? this.idTipoDocumento.value.id : '',
                idTipoDocumento: this.idTipoDocumentoSelecionado ?? '', 
                nome: this.filtro.nome || '',
                opme: this.ajustarCampo(this.filtro.opme),
                ativo: this.ajustarCampo(this.filtro.ativo),
                link: this.ajustarCampo(this.filtro.link)
            }
        }).then();
    }

    ajustarCampo(campo:any):any{
        let retorno = '';
        if(campo && campo === 'S'){
            return 'S';
        }

        return retorno;
    }
   
    public limparCampos(): void {
        this.filtro = new FiltroConsultaDocumento();
        this.idTipoDocumento.setValue('');
        this.selectedOption = null;
        this.selectedValue = null;
        this.documento = null;
        this.idTipoDocumentoSelecionado = null;
        localStorage.clear();
    }

    tipoSelecionado(tipo: any) {
        this.documento = tipo.nome;
        this.idTipoDocumentoSelecionado = tipo.id;
    }

    public voltar(): void {
        this.location.back();
    }
}
