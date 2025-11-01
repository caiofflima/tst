import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {SelectItem} from "primeng/api";
import {TipoDocumentoService} from "../../../shared/services/comum/tipo-documento.service";
import {BaseComponent} from "../../../shared/components/base.component";
import {MessageService} from "../../../shared/components/messages/message.service";
import {DocumentoService} from "../../../shared/services/comum/documento.service";
import {FiltroConsultaDocumento} from "../../../shared/models/filtro/filtro-consulta-documento";
import {FormControl} from "@angular/forms";
import {TipoDocumento} from "../../../shared/models/comum/tipo-documento";
import {Location} from "@angular/common";

@Component({
    selector: 'asc-parametrizacao-documentos-home',
    templateUrl: './parametrizacao-documentos-home.component.html',
    styleUrls: ['./parametrizacao-documentos-home.component.scss']
})
export class ParametrizacaoDocumentosHomeComponent extends BaseComponent implements OnInit {
    tipoDocumentos: SelectItem[];
    tipoDocumento: TipoDocumento;
    filtro: FiltroConsultaDocumento;
    documento: string;
    idTipoDocumento = new FormControl(null);
    

    constructor(
        override readonly messageService: MessageService,
        private readonly service: TipoDocumentoService,
        private readonly serviceDocumento: DocumentoService,
        private readonly route: Router,
        private readonly location: Location
    ) {
        super(messageService)
    }

    ngOnInit(): void {
        this.filtro = new FiltroConsultaDocumento();
        this.getTipoDocumento();
    }


    

    public limparCampos(): void {
        this.filtro = new FiltroConsultaDocumento();
        this.idTipoDocumento.setValue('');
    }

    getTipoDocumento(): void {
        this.service.consultarTodos().subscribe(result => {
            this.tipoDocumentos = result.map(item => ({
                label: item.nome,
                value: item
            }));
        });
    }

    pesquisar(): void {
        this.route.navigate(['manutencao/parametros/documentos/buscar'], {
            queryParams: {
                documento: this.documento || '',
                idTipoDocumento: this.idTipoDocumento.value ? this.idTipoDocumento.value.id : '',
                nome: this.filtro.nome || '',
                opme: this.filtro.opme || '',
                ativo: this.filtro.ativo || '',
                link: this.filtro.link || ''
            }
        }).then();
    }

    tipoSelecionado(tipo: any) {
        this.documento = tipo.nome;
    }

    public voltar(): void {
        this.location.back();
    }
}
