import {Component, ViewChild} from '@angular/core';
import {FiltroConsultaEmpresa} from 'app/shared/models/filtro/filtro-consulta-empresa';
import {Data} from 'app/shared/providers/data';
import {BaseComponent} from 'app/shared/components/base.component';
import {MessageService} from 'app/shared/components/messages/message.service';
import {Router} from '@angular/router';
import {EmpresaPrestadorExternoService} from 'app/shared/services/comum/empresa-prestador-externo.service';

@Component({
    selector: 'app-empresa-credenciada-listar',
    templateUrl: './empresa-credenciada-listar.component.html',
    styleUrls: ['./empresa-credenciada-listar.component.scss']
})
export class EmpresaCredenciadaListarComponent extends BaseComponent {
@ViewChild('caixaTableEmpresaCredenciadaListar')caixaTableEmpresaCredenciadaListar:any
    filtro: FiltroConsultaEmpresa;
    listaEmpresas: any[];

    constructor(
        protected override messageService: MessageService,
        protected empresaService: EmpresaPrestadorExternoService,
        private data: Data,
        private router: Router
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
        this.empresaService.consultarPorFiltro(this.filtro).subscribe(res => {
            this.listaEmpresas = res;
        }, err => this.showDangerMsg(err.error));
    }

    get totalSize(): number {
        return this.listaEmpresas?.length || 0;
    }

    get mensagemPaginacao(): string {
        const total = this.totalSize;
        return total > 0 ? `Exibindo ${total} registro${total > 1 ? 's' : ''}` : 'Nenhum registro encontrado';
    }

    retornarListaEmpresas() {
        return this.router.navigateByUrl('/manutencao/empresa-prestador-externo');
    }   
    
    applyGlobalFilter(evento:Event){
        const input = evento.target as HTMLInputElement
        const value = input.value
        this.caixaTableEmpresaCredenciadaListar.filterGlobal(value,'contains')
    }
}
