import { DuvidasService } from './../../../shared/services/comum/duvidas.service';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BundleUtil } from 'app/arquitetura/shared/util/bundle-util';
import { ProcedimentoReembolso } from 'app/shared/models/comum/ProcedimentoReembolso';
import { Procedimento } from 'app/shared/models/entidades';
import { MessageService, ProcedimentoService } from 'app/shared/services/services';

@Component({
  selector: 'asc-listar-procedimentos-com-reembolso',
  templateUrl: './listar-procedimentos-com-reembolso.component.html',
  styleUrls: ['./listar-procedimentos-com-reembolso.component.scss'],
  providers: [
    DuvidasService
  ]
})
export class ListarProcedimentosComReembolsoComponent implements OnInit {
  listaProcedimentos: ProcedimentoReembolso[];
  procedimento: Procedimento;
  loading = false;
  rowCounter: number = 10;
  tituloPagina = 'Tabela Reembolso'
  registrosSelecionados: any[] = [];

  constructor(
    private readonly procedimentoService: ProcedimentoService,
    private readonly location: Location,
    private messageService: MessageService,
    public duvidasService: DuvidasService,
    private titleService: Title
  ) { 

  }

  ngOnInit() {
    this.carregarProcedimentosReembolso();
    const title = `${this.titleService.getTitle()} - Tabela Reembolso`
    this.titleService.setTitle(title)
    
  }

  carregarProcedimentosReembolso() {
    this.loading = true;
    this.procedimentoService.listarProcedimentosComReembolso()
    .subscribe((procedimentos : ProcedimentoReembolso[]) => {
    this.listaProcedimentos = procedimentos
    .filter((prod, i, arr) => arr.findIndex(t =>t.estruturaNumerica === prod.estruturaNumerica)===i);   
    this.loading = false;
  }, error => {
      this.loading = false;
      this.messageService.addMsgDanger(error.message);
  })
  }

  voltar(): void {
      this.location.back();
  }

  selecionarPerfis(event: any): void {
    // Método para lidar com seleção de linhas
  }

  deSelecionarPerfis(event: any): void {
    // Método para lidar com desseleção de linhas
  }

  public exportarExcel(){
    const columnNames =  ['Código', 'Nome do Procedimento', 'R$ Reembolso', 'Dep. Rest', 'Aux.', 'Instr.', ' Intervalo entre atendimentos', 'Idade Mínima', 'Idade Máxima', 'AP'];
    const ordemColumnNames = ['estruturaNumerica', 'descricao', 'vlrReembolso',  'permitidoDepRestrito','qtdAuxiliares', 'preveInstrumentador', 'intervaloAtendimentos', 'idadeMinima', 'idadeMaxima', 'autorizacaoPrevia' ];

    this.exportToCSV(this.listaProcedimentos, "ProcedimentosReembolso", columnNames, ordemColumnNames);

  }

  exportToCSV(data: any[], fileName: string, columnNames: string[], ordemColumnNames: string[]){

    const formatData = data.map(dt => ({...dt, 
      descricao: String(dt.descricao).replace(';','').replace('.;',''), 
      vlrReembolso: dt.vlrReembolso.toLocaleString('pt-br', {minimumFractionDigits: 2}),
      permitidoDepRestrito: this.getSimNao(dt.permitidoDepRestrito),
      preveInstrumentador: this.getSimNao(dt.preveInstrumentador),
      idadeMinima: this.formatarIdade(dt.idadeMinima),
      idadeMaxima: this.formatarIdade(dt.idadeMaxima),
      autorizacaoPrevia: this.getSimNao(dt.autorizacaoPrevia)
    }
    ));

    const rows = formatData.map(obj => this.mapObjectToColumn(obj, ordemColumnNames));

    const header = columnNames.join(';');

    const csv = "\ufeff" + [header, ...rows].join('\n'); /* \ufeff - acrestentado para ativar o charset */

    const blob = new Blob([csv], {type: "text/plain; charset=utf-8"});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.csv`
    a.click();
    window.URL.revokeObjectURL(url);
  }

  mapObjectToColumn(obj:any, columnNames: string[]){
    return columnNames.map(col => obj[col]).join(';');
    }


  public bundle(key: string, args?: any): string {
      return BundleUtil.fromBundle(key, args);
  }

  private getSimNao(value: any): string{
    return value=='S'?'Sim':'Não';
  }

  private formatarIdade(value: any): string{
    if(value =='0' || value == '999'){
      return '-'
    }
    return value
  }



}
