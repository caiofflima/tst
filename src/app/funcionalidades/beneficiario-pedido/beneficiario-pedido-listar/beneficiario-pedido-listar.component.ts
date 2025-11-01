import {Component} from '@angular/core';
import {MessageService} from "../../../shared/components/messages/message.service";
import {BaseComponent} from "../../../shared/components/base.component";
import {ActivatedRoute, Router} from '@angular/router';
import {take} from "rxjs/operators";
import {NumberUtil} from "../../../shared/util/number-util";
import {Location} from "@angular/common";
import { BeneficiarioPedidoService } from 'app/shared/services/services';
import { BeneficiarioPedido } from 'app/shared/models/comum/beneficiario-pedido';


@Component({
    selector: 'asc-beneficiario-pedido-listar',
    templateUrl: './beneficiario-pedido-listar.component.html',
    styleUrls: ['./beneficiario-pedido-listar.component.scss']
})
export class BeneficiarioPedidoListarComponent extends BaseComponent {
    titulo: string
    public id: number;
    public tiposBeneficiario: number[];
    public idsTipoProcesso: number[];
    public somenteAtivos: boolean;

    loading = false;
    listaTotal: number = 0;
    listaPedidoBeneficiario: BeneficiarioPedido[];
    descricaoSituacoes: string;
    descricaoTiposProcesso: string;
    descricaoTiposBeneficiario: string;
    override baseURL: string
    constructor(
        override readonly messageService: MessageService,
        private readonly location: Location,
        private readonly router: Router,
        private readonly route: ActivatedRoute,
        private readonly beneficiarioPedidoService: BeneficiarioPedidoService,
    ) {
        super(messageService);
        this.titulo = this.beneficiarioPedidoService.getTitulo()
        this.baseURL = this.beneficiarioPedidoService.getBaseURL()
        this.id = this.route.snapshot.queryParams['id'];
       
        this.idsTipoProcesso = NumberUtil.getArray(this.route.snapshot.queryParams['tiposProcesso']);
        this.tiposBeneficiario = this.route.snapshot.queryParams['tiposBeneficiario'];
       
        this.somenteAtivos = this.route.snapshot.queryParams['somenteAtivos'] == 'true' ? true : false;
        
        this.descricaoTiposProcesso = this.route.snapshot.queryParams['descricaoTiposProcesso'];
        this.descricaoTiposBeneficiario = this.route.snapshot.queryParams['descricaoTiposBeneficiario'];

        this.loading = true;
        const dto: BeneficiarioPedido = {
            id: this.id,
            idsTipoProcesso: this.idsTipoProcesso,
            somenteAtivos: this.somenteAtivos,
            tiposBeneficiario: this.tiposBeneficiario
        }
        this.beneficiarioPedidoService.consultarPorFiltro(dto)
        .pipe(
            take<BeneficiarioPedido[]>(1)
        ).subscribe(res => {
            if( res.length === 0 ){
                this.showWarningMsg( this.bundle( 'MA142' ) )
                this.location.back()
            }else{
                this.listaPedidoBeneficiario = res.map(l => ({
                    ...l,
                    nomeTiposBeneficiario: l.nomeTiposBeneficiario || '—',
                    tipoProcesso: l.tipoProcesso || '—',
                    inativo: l.inativo === 'SIM' ? 'Sim' : 'Não'
                }));
                this.loading = false;

            }
        }, err => {
            this.loading = false;
            this.showDangerMsg(err.error);
        });
    }

    public novo() {
        this.router.navigate([`${this.baseURL}/novo`]);
    }

    public editar(prazoTratamento: BeneficiarioPedido) {
        //const str = this.encodeToBase64( JSON.stringify( prazoTratamento )  )
        this.router.navigateByUrl(`${this.baseURL}/editar/` + this.utf8_to_b64( JSON.stringify( prazoTratamento )  ));
    }

    voltar(): void {
        this.location.back();
    }

    utf8_to_b64(str: string) {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
            return String.fromCharCode(parseInt(p1, 16));
        }));
    }
      

}
