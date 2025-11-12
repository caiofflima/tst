import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from 'app/shared/components/base.component';
import { MessageService } from 'app/shared/components/messages/message.service';
import { EmpresaPrestadora } from 'app/shared/models/comum/empresa-prestadora';
import { FiltroConsultaEmpresa } from 'app/shared/models/filtro/filtro-consulta-empresa';
import { Data } from 'app/shared/providers/data';
import { EmpresaPrestadorExternoService } from 'app/shared/services/comum/empresa-prestador-externo.service';
import { CNPJ_MASK } from 'app/shared/util/masks';

@Component({
  selector: 'app-empresa-credenciada-home',
  templateUrl: './empresa-credenciada-home.component.html',
  styleUrls: ['./empresa-credenciada-home.component.scss']
})
export class EmpresaCredenciadaHomeComponent  extends BaseComponent implements OnInit {

  maskCnpj: string = null;
  listaEmpresas = new Array<EmpresaPrestadora>();
  filtro: FiltroConsultaEmpresa;

  constructor(
    protected override messageService: MessageService,
    protected empresaService: EmpresaPrestadorExternoService,
    private router: Router,
    private data: Data
  ) {
    super(messageService);
    this.maskCnpj = CNPJ_MASK;
    this.filtro = new FiltroConsultaEmpresa();
    if (this.data.storage && this.data.storage.filtroEmpresa) {
      this.filtro = this.data.storage.filtroEmpresa;
    }
  }

  ngOnInit() {
    // no aguardo de funcionalidades
  }

  limparCampos() {
    this.filtro = new FiltroConsultaEmpresa();
  }

  pesquisarEmpresas(){
    if (this.filtro.cnpj != null) {
      this.filtro.cnpj = this.filtro.cnpj.replace("/","").replace("-","").replace(/\./g,'');
    }
    this.data.storage = { filtroEmpresa: this.filtro };
    this.router.navigateByUrl('/manutencao/empresa-prestador-externo/busca');
  }

  novaEmpresa(){
    this.router.navigateByUrl('/manutencao/empresa-prestador-externo/novo');
    this.router.navigate(['/manutencao/empresa-prestador-externo/novo']);
  }
}
