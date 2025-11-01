import { Component, OnInit, Input } from '@angular/core';
import { Router } from "@angular/router";
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/api';

import { BaseComponent } from "../../../shared/components/base.component";
import { MessageService } from "../../../shared/components/messages/message.service";
import {SessaoService} from 'app/shared/services/services';
import {Location} from "@angular/common";
@Component({
  selector: 'asc-extrato-irpf',
  templateUrl: './extrato-irpf.component.html',
  styleUrls: ['./extrato-irpf.component.scss']
})

export class ExtratoIRPFComponent extends BaseComponent implements OnInit {

  anoBase = new FormControl(null);

  anos: SelectItem[] = [];
  anoCorrente = null;
  anoLancamento = null;
  limiteUltimosCincoAnos: number = 4;


  readonly formularioExtratoIRPF = this.formBuilder.group({
    anoBase: this.anoBase,
  });

  constructor(
    protected override readonly messageService: MessageService,
    private readonly route: Router,
    private readonly location: Location,
    private readonly formBuilder: FormBuilder,
    private readonly sessaoService: SessaoService
  ) {
    super(messageService)
  }

  voltar(): void {
    this.location.back();
}

  ngOnInit(): void {
    this.anoCorrente = new Date().getFullYear()-1;
    this.carregarComboAno();
  }

  carregarComboAno() {
    this.anos.push({value: this.anoCorrente, label: String(this.anoCorrente)});
    for (let i = 1; i <= this.limiteUltimosCincoAnos; i++) {
        this.anos.push({value: this.anoCorrente - i, label: String(this.anoCorrente - i) });
    }
    this.anoLancamento =  this.anos.find(obj => obj.value === this.anoCorrente);
  }

  gerarExtrato(): void {
    this.route.navigate(['meus-dados/financeiro/extrato-irpf/detalhar'], {
      queryParams: {
        anoBase: this.anoLancamento.value || '',
        mtr: SessaoService.getMatriculaFuncional() || ''
      }
    }).then();
  }

}
