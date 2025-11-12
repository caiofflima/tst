import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {take} from "rxjs/operators";
import {Location} from "@angular/common";
import * as url from "url";
import {BaseComponent} from 'app/shared/components/base.component';
import {MessageService} from 'app/shared/components/messages/message.service';
import {CNPJ_MASK} from 'app/shared/util/masks';
import {AscValidators} from 'app/shared/validators/asc-validators';
import {Filial} from 'app/shared/models/comum/filial';
import {FilialDTO} from 'app/shared/models/dto/filial';
import {UF} from 'app/shared/models/uf';
import {ComboService} from 'app/shared/services/comum/combo.service';
import {DadoComboDTO} from 'app/shared/models/dto/dado-combo';
import {EmpresaPrestadorExternoService} from 'app/shared/services/comum/empresa-prestador-externo.service';
import {EmpresaPrestadora} from 'app/shared/models/comum/empresa-prestadora';

@Component({
    selector: "app-empresa-prestador-externo-form",
    templateUrl: "./empresa-prestador-externo-form.component.html",
    styleUrls: ["./empresa-prestador-externo-form.component.scss"]
})
export class EmpresaPrestadorExternoFormComponent extends BaseComponent implements OnInit {
    @ViewChild('caixaTableEmpresaPrestadorExternoForm')caixaTableEmpresaPrestadorExternoForm:any
    maskCnpj: string = null;
    filiais: Array<Filial>;
    filiaisAdd: Array<FilialDTO> = [];
    filial: Filial = new Filial();
    municipio: string;
    uf: UF;
    filialDTO: FilialDTO = new FilialDTO();
    empresaPrestadora: EmpresaPrestadora = new EmpresaPrestadora();
    mensagemSucesso: string;
    formulario: FormGroup;

    UFEmpresaAdd: Array<UF> = [];
    UFEmpresa: UF = new UF();
    listComboUF: DadoComboDTO[];
    abrangenciaAdd: Array<AbrangenciaDTO> = [];


    constructor(
        override readonly messageService: MessageService,
        private readonly empresaPrestadorService: EmpresaPrestadorExternoService,
        private readonly formBuilder: FormBuilder,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly location: Location,
        private readonly comboService: ComboService,
    ) {
        super(messageService);


        this.maskCnpj = CNPJ_MASK;
        this.inicializarFormulario();
        this.buscarFiliais();
        this.carregarUFS();
    }

    id = this.formBuilder.control(null);
    cnpj = this.formBuilder.control(null, [Validators.required, AscValidators.cnpj]);
    razaoSocial = this.formBuilder.control(null, [Validators.required]);
    contrato = this.formBuilder.control(null)
    email = this.formBuilder.control(null);

    private inicializarFormulario() {
        this.formulario = this.formBuilder.group({
            id: this.id,
            cnpj: this.cnpj,
            razaoSocial: this.razaoSocial,
            contrato: this.contrato,
            dataCadastramento: [this.empresaPrestadora.dataCadastramento],
            matriculaCadastramento: [this.empresaPrestadora.matriculaCadastramento],
            filial: [this.filialDTO.nome],
            unidade: [this.filialDTO.unidade],
            email: this.email,
            UFEmpresa: [this.UFEmpresa.nome]
        });
    }

    ngOnInit() {
        if (this.route.snapshot.params["id"]) {
            this.empresaPrestadora = new EmpresaPrestadora();
            this.empresaPrestadorService.consultarEmpresaPorId(this.route.snapshot.params["id"]).pipe(
                take<EmpresaPrestadora>(1)
            ).subscribe(res => {
                const empresa = res;
                empresa.razaoSocial = empresa.razaoSocial.toUpperCase();
                EmpresaPrestadorExternoFormComponent.setValuesForm(this.formulario, empresa);
                empresa.filiais = [];
                if (empresa.empresaUnidades) {
                    empresa.empresaUnidades.forEach(empresaUnidade => {
                        this.adicionarFilial(empresaUnidade.filial);
                    });
                }
                this.empresaPrestadora = empresa;
            });
        }
    }

    applyGlobalFilter(evento:Event){
        const input = evento.target as HTMLInputElement
        const value = input.value
        this.caixaTableEmpresaPrestadorExternoForm.filterGlobal(value,'contains')
    }

    private static setValuesForm(formulario, empresaPrestadora) {
        for (let key in empresaPrestadora) {
            if (formulario.controls[key] != undefined) {
                formulario.controls[key].setValue(empresaPrestadora[key]);
            }
        }
    }

    public buscarFiliais() {
        this.empresaPrestadorService.consultarFiliais().subscribe(res => {
            this.filiais = this.tratarComboFilial(res);
            this.filiais = res.map(filial => ({
                ...filial,
                nome: filial.municipio.nome.toUpperCase()
            }));
        });
    }

    private tratarComboFilial(res: Filial[]): Filial[] {
        return res.map(filial => {
            const municipio: any = {
                ...filial.municipio,
                nome: filial.municipio.nome ? filial.municipio.nome.toUpperCase() : ''
            };
            return {
                ...filial,
                municipio
            };
        });
    }

    public carregarUFS() {
            this.comboService.consultarComboUF().pipe(take(1)).subscribe(res => {
                this.listComboUF = res; 
            }, err => this.showDangerMsg(err.error));
    }

    public mostrarFiltro(){
        if(this.filiaisAdd.length > 0 || this.UFEmpresaAdd.length > 0)
            return true
        else
            return false;
    }

    public onChangeFilial(){
        if(this.formulario.controls['UFEmpresa'].value != null)
           this.formulario.get("UFEmpresa").reset();
    }

    public onChangeUFEmpresa(){
        if(this.formulario.controls['filial'].value != null)
            this.formulario.get("filial").reset();
    }

    public adicionarAbrangencia() {
        if(this.formulario.controls['UFEmpresa'].value !== null){
            this.adicionarUFEmpresa(this.formulario.controls['UFEmpresa'].value);
        }   
        else if(this.formulario.controls['filial'].value !== null){
            this.adicionarFilial(this.formulario.controls['filial'].value);
        }
            
    }

    public adicionarFilial(filial) {
        this.formulario.get("filial").reset();
        this.formulario.get("UFEmpresa").reset();
        if (filial != null) {
            let existe = false;
            this.filiaisAdd.forEach(element => {
                if (element.id == filial.id) {
                    existe = true;
                }
            });
            if (!existe) {
                this.filialDTO = new FilialDTO();
                this.filialDTO.id = filial.id;
                this.filialDTO.nome = filial.nome;
                this.filiaisAdd = [...this.filiaisAdd, this.filialDTO];
                this.abrangenciaAdd = [...this.abrangenciaAdd, new AbrangenciaDTO(filial.id, filial.nome)];
            }
        } else {
            this.formulario.get("filial").markAsTouched();
        }
    }

    public adicionarUFEmpresa(UFEmpresa) {
        this.formulario.get("UFEmpresa").reset();
        this.formulario.get("filial").reset();

        if (UFEmpresa !== null) {

            let existe = this.UFEmpresaAdd.find(uf=>uf.id === UFEmpresa.value );

            if (!existe) {
                let unidade = new UF();
                unidade.id = UFEmpresa.value;
                unidade.sigla = UFEmpresa.label;
                unidade.nome = UFEmpresa.label;
                this.UFEmpresaAdd = [...this.UFEmpresaAdd, unidade];
                this.abrangenciaAdd = [...this.abrangenciaAdd, new AbrangenciaDTO(UFEmpresa.value, UFEmpresa.label)];
            }
        } else {
            this.formulario.get("UFEmpresa").markAsTouched();
        }
    }

    public limparCampos(): void {
        this.formulario.reset();
        this.formulario.markAsPristine();
        this.formulario.markAsUntouched();
        this.formulario.updateValueAndValidity();
        this.filiaisAdd = [];
        this.UFEmpresaAdd = [];
        this.abrangenciaAdd = [];
    }

    public removerAbrangencia(item) {
        this.abrangenciaAdd = this.abrangenciaAdd.filter(ab=>ab.id !== item.id);
        this.removerUFEmpresa(item);
        this.removerFilial(item);
    }

    public removerUFEmpresa(item) {
        this.UFEmpresaAdd = this.UFEmpresaAdd.filter(ab=>ab.id !== item.id);
    }

    public removerFilial(item) {
        this.filiaisAdd =  this.filiaisAdd.filter(ab=>ab.id !== item.id);
    }

    public salvar(): void {
        if (
            this.formulario.get("cnpj").valid &&
            this.formulario.get("razaoSocial").valid &&
            this.validarFiliais()

        ) {
            let empresa: EmpresaPrestadora = this.formulario.value;
            empresa.filiais = this.filiaisAdd;
            empresa.cnpj = empresa.cnpj
            .replace("/", "")
            .replace("-", "")
            .replace(/\./g, "");

            this.mensagemSucesso = this.formulario.get("id").value != null ? "MA022" : "MA038"
            this.empresaPrestadorService.salvar(empresa).subscribe(async () => {
                    this.showSuccessMsg(this.bundle(this.mensagemSucesso));
                    this.limparCampos();
                    await this.router.navigateByUrl("/manutencao/empresa-prestador-externo") ;
                }, err => this.showDangerMsg(err.error)
            );
        } else {
            this.validateAllFormFields(this.formulario);
        }
    }

    private validarFiliais(): boolean {
        if (this.filiaisAdd.length == 0) {
            this.formulario.get("filial").markAsTouched();
            return false;
        }
        return true;
    }

    private validarUFEmpresa(): boolean {
        if (this.validarUFEmpresa.length == 0) {
            //this.formulario.get("validarUFEmpresa").markAsTouched();
            return false;
        }
        return true;
    }


    public excluirEmpresa(empresa) {
        this.messageService.addConfirmYesNo(this.bundle('MA021'),
            () => {
                this.empresaPrestadorService.excluirEmpresa(empresa.id).subscribe(async () => {
                    this.showSuccessMsg(this.bundle('MA039'));
                    await this.router.navigateByUrl("/manutencao/empresa-prestador-externo");
                }, err => this.showDangerMsg(err.error));
            }, null, null, 'Sim', 'Não');
    }

    voltar(): void {
        this.location.back();
    }


}
class AbrangenciaDTO {
    id: string;
    nome: string;

    constructor(id: string, nome: string){
        this.id = id;
        this.nome = nome;
    }
}