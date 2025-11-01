import {Component, ViewChild} from '@angular/core';
import {FiltroConsultaEmpresa} from 'app/shared/models/filtro/filtro-consulta-empresa';
import {Data} from 'app/shared/providers/data';
import {BaseComponent} from 'app/shared/components/base.component';
import {MessageService} from 'app/shared/components/messages/message.service';
import {Router} from '@angular/router';
import {EmpresaPrestadorExternoService} from 'app/shared/services/comum/empresa-prestador-externo.service';
import {Location} from "@angular/common";

@Component({
    selector: 'app-empresa-prestador-externo-listar',
    templateUrl: './empresa-prestador-externo-listar.component.html',
    styleUrls: ['./empresa-prestador-externo-listar.component.scss']
})
export class EmpresaPrestadorExternoListarComponent extends BaseComponent {
    @ViewChild('caixaTableEmpresaPrestadorExternoListar')caixaTableEmpresaPrestadorExternoListar:any
    filtro: FiltroConsultaEmpresa;
    listaEmpresas: any[];

    constructor(
        override readonly  messageService: MessageService,
        private readonly empresaService: EmpresaPrestadorExternoService,
        private readonly data: Data,
        private readonly location: Location,
        private readonly router: Router
    ) {
        super(messageService);
        if (this.data.storage) {
            if (this.data.storage.filtroEmpresa) {
                this.filtro = this.data.storage.filtroEmpresa;
            } else {
                this.filtro = new FiltroConsultaEmpresa();
            }
        }
        this.pesquisarEmpresas();
    }

    editarEmpresa(empresa) {
        this.router.navigateByUrl('/manutencao/empresa-prestador-externo/editar/' + empresa.id);
    }

    novaEmpresa() {
        this.router.navigateByUrl('/manutencao/empresa-prestador-externo/novo');
        this.router.navigate(['/manutencao/empresa-prestador-externo/novo']);
    }

    pesquisarEmpresas() {
        console.log("this.empresaService.consultarPorFiltro ========");
        console.log(this.filtro);
        this.filtro.razaoSocial = this.verificarArrayEConverter(this.filtro.razaoSocial);

        if (this.filtro.cnpj != null) {
            this.filtro.cnpj = this.filtro.cnpj.replace("/", "")
            .replace("-", "").replace(/\./g, '');
        }
        console.log("[REVISADO] this.empresaService.consultarPorFiltro ========");
        console.log(this.filtro);
        this.empresaService.consultarPorFiltro(this.filtro).subscribe(res => {
            console.log(res);
            this.listaEmpresas = res.map((objeto:any)=>{
                objeto.razaoSocial = this.verificarArrayEConverter(objeto.razaoSocial);
                objeto.razaoSocial = objeto.razaoSocial.toUpperCase();
                objeto.gipes = objeto.gipes.toUpperCase();
                return objeto;
            });
            console.log(res);
            console.log("[FIM] this.empresaService.consultarPorFiltro ========");
        }, err => this.showDangerMsg(err.error));
    }

    verificarArrayEConverter(array:any):string{
        if(array === null || array === undefined)
            return null;
        
        if(typeof array === "string")
            return array;
        
        if(Array.isArray(array)){
            if(array.length > 0)
                return JSON.stringify(array);
            else
                return null;
        }else {
            return null
        }
    }

    voltar(): void {
        this.location.back();
    }

    applyGlobalFilter(evento:Event){
        const input = evento.target as HTMLInputElement
        const value = input.value
        this.caixaTableEmpresaPrestadorExternoListar.filterGlobal(value,'contains')
    }
}
