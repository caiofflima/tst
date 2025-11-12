import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {BaseComponent} from 'app/shared/components/base.component';
import {MessageService} from 'app/shared/components/messages/message.service';
import {FiltroConsultaEmpresa} from 'app/shared/models/filtro/filtro-consulta-empresa';
import {Data} from 'app/shared/providers/data';
import {CNPJ_MASK} from 'app/shared/util/masks';
import {Location} from "@angular/common";
import {DadoComboDTO} from 'app/shared/models/dto/dado-combo';
import {SessaoService} from "../../../arquitetura/shared/services/seguranca/sessao.service";
import {ComboService} from 'app/shared/services/comum/combo.service';
import {EmpresaPrestadorExternoService} from 'app/shared/services/comum/empresa-prestador-externo.service';
import {EmpresaPrestadora} from 'app/shared/models/comum/empresa-prestadora';
import { take } from 'rxjs';

@Component({
    selector: 'app-empresa-prestador-externo-home',
    templateUrl: './empresa-prestador-externo-home.component.html',
    styleUrls: ['./empresa-prestador-externo-home.component.scss'],
    providers: [ComboService]
})
export class EmpresaPrestadorExternoHomeComponent extends BaseComponent implements OnInit{

    maskCnpj: string = null;
    filtro: FiltroConsultaEmpresa;

    listComboUF: DadoComboDTO[];
    listComboFilial: DadoComboDTO[];

    formulario: FormGroup;


    constructor(
        override readonly messageService: MessageService,
        private readonly router: Router,
        private readonly data: Data,
        private readonly location: Location,
        private readonly comboService: ComboService,
        public readonly sessaoService: SessaoService,
        private readonly formBuilder: FormBuilder,
    ) {
        super(messageService);
        this.maskCnpj = CNPJ_MASK;
        this.filtro = new FiltroConsultaEmpresa();
        if (this.data.storage && this.data.storage.filtroEmpresa) {
            this.filtro = this.data.storage.filtroEmpresa;
        }

        this.formulario = this.formBuilder.group({
            'cnpj': [this.filtro.cnpj],
            'razaoSocial': [this.filtro.razaoSocial],
            'contrato': [this.filtro.contrato],
            'ufsProcesso': [this.filtro.ufsProcesso],
            'filiaisProcesso': [this.filtro.filiaisProcesso],
            'ativos': [this.filtro.ativos],
        });

    }

    ngOnInit(){
        this.carregarCombos();  
    }

    carregarCombos(){
        this.comboService.consultarComboUF().pipe(take(1)).subscribe(res => {
            this.listComboUF = res;
        }, err => this.showDangerMsg(err.error));

        this.comboService.consultarComboFilial().pipe(take(1)).subscribe(res => {
           this.listComboFilial = this.tratarComboFilial(res);
        }, err => this.showDangerMsg(err.error));
    }

    private tratarComboFilial(res: DadoComboDTO[]): DadoComboDTO[] {
        return res.map(filial => ({
            ...filial,
            label: filial.label ? filial.label.toUpperCase() : ''
        }));
    }

    limparCampos() {
        this.filtro = new FiltroConsultaEmpresa();
    }
    pesquisarEmpresas() {
        if (this.filtro.cnpj != null) {
                this.filtro.cnpj = this.filtro.cnpj.replace("/", "")
                .replace("-", "").replace(/\./g, '');
            }
            this.data.storage = {
                filtroEmpresa: this.formulario.value
            };
            this.router.navigateByUrl('/manutencao/empresa-prestador-externo/busca');

    }
    novaEmpresa() {
        this.router.navigateByUrl('/manutencao/empresa-prestador-externo/novo');
        this.router.navigate(['/manutencao/empresa-prestador-externo/novo']);
    }

    voltar(): void {
        this.location.back();
    }

}
