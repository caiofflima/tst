import { DuvidasService } from 'app/shared/services/comum/duvidas.service';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BundleUtil } from 'app/arquitetura/shared/util/bundle-util';
import { Procedimento } from 'app/shared/models/entidades';
import { MessageService } from 'app/shared/services/services';
import { MedicamentoPatologiaService } from 'app/shared/services/comum/medicamento-patologia.service';
import { MedicamentoPatologia } from 'app/shared/models/comum/medicamento-patologia';

@Component({
  selector: 'asc-listar-procedimentos-com-medicamento',
  templateUrl: './listar-procedimentos-com-medicamento.component.html',
  styleUrls: ['./listar-procedimentos-com-medicamento.component.scss'],
  providers: [
    DuvidasService
  ]
})
export class ListarProcedimentosComMedicamentoComponent implements OnInit {
  listaMedicamentos: MedicamentoPatologia[];
  procedimento: Procedimento;
  loading = false;
  rowCounter: number = 10;
  tituloPagina = 'Tabela de Reembolso de Medicamentos do Saúde Caixa';
  
  constructor(
    private readonly medicamentoPatologiaService: MedicamentoPatologiaService,
    private readonly location: Location,
    private messageService: MessageService,
    public duvidasService: DuvidasService,
    private titleService: Title
  ) { 

  }

  ngOnInit() {
    this.carregarMedicamentos();
    const title = `${this.titleService.getTitle()} - Tabela de Medicamentos`
    this.titleService.setTitle(title)
  }

  carregarMedicamentos() {
    this.loading = true;
    this.medicamentoPatologiaService.consultarPorFiltro(null, null, true)
    .subscribe((medicamentoPatologias : MedicamentoPatologia[]) => {
    this.listaMedicamentos = medicamentoPatologias
    this.loading = false;
    }, error => {
      this.loading = false;
      this.messageService.addMsgDanger(error.message);
    }) 
  }

  voltar(): void {
      this.location.back();
  }

  public exportarExcel(){
    const columnNames =  ['Patalogia', 'Perc. Reemb.', 'Comp. Teto', 'Laborat', 'Medicamento', 'Apresent.'];
    const ordemColumnNames = ['nomePatologia', 'reembolso', 'compoeTeto', 'nomeLaboratorio', 'nomeMedicamento', 'nomeApresentacao'];

    this.exportToCSV(this.listaMedicamentos, "MedicamentosReembolso", columnNames, ordemColumnNames);

  }

  exportToCSV(data: any[], fileName: string, columnNames: string[], ordemColumnNames: string[]){

    const formatData = data.map(dt => ({...dt, 
        nomePatologia: dt.nomePatologia,
        reembolso: this.getPercentual(dt.reembolso),
        compoeTeto: this.getSimNao(dt.compoeTeto),
        nomeLaboratorio: dt.nomeLaboratorio,
        nomeMedicamento: dt.nomeMedicamento,
        nomeApresentacao: dt.nomeApresentacao
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

  getPercentual(value: number): string {
    return value === null ? '' : value + '%';
  }

}
