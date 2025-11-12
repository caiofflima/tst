import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {take} from "rxjs/operators";
import {Location} from "@angular/common";
import {FormControl, FormBuilder} from "@angular/forms";

import {BaseComponent} from 'app/shared/components/base.component';
import {MessageService} from 'app/shared/components/messages/message.service';
import {FiltroConsultaPrestadorExterno} from 'app/shared/models/filtro/filtro-consulta-prestador-externo';
import {Data} from 'app/shared/providers/data';
import {COD_USUARIO_MASK, CPF_MASK} from 'app/shared/util/masks';
import {DadoComboDTO} from "../../../shared/models/dto/dado-combo";
import {ComboService} from 'app/shared/services/services';
import {EmpresaPrestadorExternoService} from "app/shared/services/comum/empresa-prestador-externo.service";
import {EmpresaPrestadora} from "app/shared/models/entidades";

@Component({
    selector: 'app-prestador-externo-home',
    templateUrl: './prestador-externo-home.component.html',
    styleUrls: ['./prestador-externo-home.component.scss']
})
export class PrestadorExternoHomeComponent extends BaseComponent implements OnInit{
    id = new FormControl(null);
    mask: string = null;
    maskCpf: string = null;
    filtro: FiltroConsultaPrestadorExterno;
    maskCodigoUsuario: string = null;
    listComboPerfil: DadoComboDTO[];
    perfis = this.formBuilder.control(null);
    empresas: DadoComboDTO[];

    constructor(
        private readonly data: Data,
        private readonly router: Router,
        private readonly location: Location,
        protected override messageService: MessageService,
        private readonly formBuilder: FormBuilder,
        private readonly comboService: ComboService,
        private readonly empresaService: EmpresaPrestadorExternoService,
    ) {
        super(messageService);
        this.maskCpf = CPF_MASK;
        this.maskCodigoUsuario = COD_USUARIO_MASK;
        this.filtro = new FiltroConsultaPrestadorExterno();
    }

    ngOnInit() {

        this.inicializarCombos();
    }

    public inicializarCombos(): void {
        this.comboService.consultarComboPerfisPrestadoresExternos().pipe(
            take<DadoComboDTO[]>(1)
        ).subscribe(res => this.listComboPerfil= res, 
            err => this.messageService.addMsgDanger(err.error));

        this.buscarEmpresas();
    }

    public buscarEmpresas() {
        this.empresaService.buscarEmpresas().subscribe(empresas => {
            this.empresas = this.tratarComboEmpresa(empresas);
        });
    }

    private tratarComboEmpresa(res: EmpresaPrestadora[]): DadoComboDTO[] {
        return res.map(empresa => 
            new DadoComboDTO((empresa.razaoSocial ? empresa.razaoSocial.toUpperCase() : ''), 
                                empresa.id, 
                                (empresa.razaoSocial ? empresa.razaoSocial.toUpperCase() : '')));
    }

    public pesquisarPrestadoresExternos(): void {
        this.router.navigate(['/seguranca/prestador-externo/busca'], {
            queryParams: {
                id: this.id.value ? this.id.value.id : '',
                cpf: this.filtro.cpf == null ? '' : this.filtro.cpf,
                nome: this.filtro.nome == null ? '' : this.filtro.nome,
                ativo: this.filtro.ativo == null ? '' : Array.isArray(this.filtro.ativo)?this.filtro.ativo[0]:this.filtro.ativo,
                codigoUsuario: this.filtro.codigoUsuario == null ? '' : this.filtro.codigoUsuario,
                idEmpresa: this.filtro.idEmpresa == null ? '' : this.filtro.idEmpresa,
                perfil: this.filtro.perfil == null ? '' : this.filtro.perfil,
            }
        }).then();
    }

    public limparCampos(): void {
        this.filtro = new FiltroConsultaPrestadorExterno();
    }

    public novoPrestadorExterno(): void {
        this.router.navigateByUrl('/seguranca/prestador-externo/novo');
    }

    public voltar(): void {
        this.location.back();
    }
}
