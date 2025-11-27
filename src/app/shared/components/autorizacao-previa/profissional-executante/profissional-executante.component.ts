import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AbstractControl, FormGroup} from '@angular/forms';
import {BaseComponent} from '../../../../../app/shared/components/base.component';
import {MessageService} from '../../../../../app/shared/components/messages/message.service';
import {ComboService} from '../../../../../app/shared/services/comum/combo.service';
import {LocalidadeService} from '../../../../../app/shared/services/comum/localidade.service';
import {SelectItem} from 'primeng/api';
import * as constantes from '../../../../../app/shared/constantes';
import {ItensUfStorage} from "../../../../arquitetura/shared/storage/itens-uf-storage";
import { Option } from 'sidsc-components/dsc-select';

@Component({
    selector: 'asc-profissional-executante',
    templateUrl: './profissional-executante.component.html',
    styleUrls: ['./profissional-executante.component.scss']
})
export class AscProfissionalExecutanteComponent extends BaseComponent implements OnInit {

    @Input('form')
    form: FormGroup;
    @Input('pedido')
    pedido: any;
    @Input('permissoesProcesso')
    permissoes: any;
    @Input('novo')
    novo: boolean;

    itensConselhoProfissional: Option[] = [];
    itensLocalidade: SelectItem[];
    itensUF: Option[] = [];
    itensUFPrimeNG: SelectItem[] = [];

    constructor(
        messageService: MessageService,
        protected router: Router,
        protected comboService: ComboService,
        protected localidadeService: LocalidadeService
    ) {
        super(messageService);
    }

    public ngOnInit(): void {
        const itensUFStorage = new ItensUfStorage().ler();
        this.itensUF = itensUFStorage.map(item => ({
            label: item.label || '',
            value: item.value
        }));
        this.itensUFPrimeNG = itensUFStorage;
        this.carregarItensCombos();
    }

    get ufAtendimento(): AbstractControl {
        return this.form.get('ufAtendimento');
    }

    get idConselhoProfissional(): AbstractControl {
        return this.form.get('idConselhoProfissional');
    }

    get numeroConselho(): AbstractControl {
        return this.form.get('numeroConselho');
    }

    get idEstadoConselho(): AbstractControl {
        return this.form.get('idEstadoConselho');
    }

    get cpfCnpj(): AbstractControl {
        return this.form.get('cpfCnpj');
    }

    get nomeProfissional(): AbstractControl {
        return this.form.get('nomeProfissional');
    }

    get idMunicipioProfissional(): AbstractControl {
        return this.form.get('idMunicipioProfissional');
    }

    public carregarItensCombos(): void {
        this.itensConselhoProfissional = [];
        this.comboService.consultarComboConselhosProfissionais().subscribe(res => {
            this.itensConselhoProfissional = res.map(item => ({
                label: item.label || '',
                value: item.value
            }));
            if (this.pedido) {
                this.idConselhoProfissional.setValue(this.pedido.idConselhoProfissional);
            }

        }, error => this.showDangerMsg(error.error));
        this.comboService.consultarComboUF().subscribe(() => {
            if (this.pedido && this.pedido.idMunicipioProfissional) {
                this.carregarItensComboMunicipioProfissional(this.pedido.idMunicipioProfissional);
            }
        });
    }

    public carregarItensComboMunicipioProfissional(idMunicipioProfissional: number): void {
        if (idMunicipioProfissional) {
            this.itensLocalidade = [];
            this.localidadeService.consultarDadosComboMunicipiosMesmaUFPorIdMunicipio(idMunicipioProfissional).subscribe(res => {
                this.itensLocalidade = []
                for (let i in res) {
                    this.itensLocalidade.push({label: res[i].nome, value: res[i].id});
                }
                this.ufAtendimento.setValue(res[0].estado.id);
                this.idMunicipioProfissional.setValue(this.pedido.idMunicipioProfissional);
            });
        }
    }

    public consultarMunicipiosAtendimento(): void {
        this.itensLocalidade = [];
        this.idMunicipioProfissional.reset();
        this.comboService.consultarDadosComboMunicipioPorUF(this.ufAtendimento.value).subscribe(res => {
            this.itensLocalidade = res;
        });
    }


    public limparCampos() {
        this.form.reset();
        this.carregarItensCombos();
    }

    override get constantes(): any {
        return constantes;
    }

    get cpfCnpjUtil(): any {
        return constantes.cpfCnpjUtil;
    }
}
