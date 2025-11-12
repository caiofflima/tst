import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {BaseComponent} from 'app/shared/components/base.component';
import {MessageService} from 'app/shared/components/messages/message.service';
import {EmpresaPrestadora} from 'app/shared/models/comum/empresa-prestadora';
import {Filial} from 'app/shared/models/comum/filial';
import {FilialDTO} from 'app/shared/models/dto/filial';
import {UF} from 'app/shared/models/uf';
import {EmpresaPrestadorExternoService} from 'app/shared/services/comum/empresa-prestador-externo.service';
import {CNPJ_MASK} from 'app/shared/util/masks';
import {AscValidators} from 'app/shared/validators/asc-validators';

@Component({
    selector: "app-empresa-credenciada-form",
    templateUrl: "./empresa-credenciada-form.component.html",
    styleUrls: ["./empresa-credenciada-form.component.scss"]
})
export class EmpresaCredenciadaFormComponent extends BaseComponent implements OnInit {
    formulario: FormGroup;
    maskCnpj: string = null;
    filiais: Array<Filial>;
    filiaisAdd: Array<FilialDTO> = [];
    filial: Filial = new Filial();
    municipio: string;
    uf: UF;
    filialDTO: FilialDTO = new FilialDTO();
    empresaPrestadora: EmpresaPrestadora = new EmpresaPrestadora();
    mensagemSucesso: string;

    constructor(
        protected override messageService: MessageService,
        protected empresaPrestadorService: EmpresaPrestadorExternoService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router
    ) {
        super(messageService);

        this.formulario = this.formBuilder.group({
            id: [this.empresaPrestadora.id],
            cnpj: [
                this.empresaPrestadora.cnpj,
                [Validators.required, AscValidators.cnpj]
            ],
            razaoSocial: [this.empresaPrestadora.razaoSocial, Validators.required],
            contrato: [this.empresaPrestadora.contrato],
            dataCadastramento: [this.empresaPrestadora.dataCadastramento],
            matriculaCadastramento: [this.empresaPrestadora.matriculaCadastramento],
            filial: [this.filialDTO.nome],
            unidade: [this.filialDTO.unidade]
        });

        this.maskCnpj = CNPJ_MASK;
        this.buscarFiliais();
    }

    ngOnInit() {
        if (this.route.snapshot.params["id"]) {
            this.empresaPrestadorService
            .consultarEmpresaPorId(this.route.snapshot.params["id"])
            .subscribe(res => {
                this.empresaPrestadora = res;

                this.setValuesForm(this.formulario, this.empresaPrestadora);
                this.empresaPrestadora.filiais = [];
                this.empresaPrestadora.empresaUnidades.forEach(empresaUnidade => {
                    this.adicionarFilial(empresaUnidade.filial);
                });
            });
        }
    }

    private setValuesForm(formulario, empresaPrestadora) {
        for (let key in empresaPrestadora) {
            if (formulario.controls[key] != undefined) {
                formulario.controls[key].setValue(empresaPrestadora[key]);
            }
        }
    }

    public buscarFiliais() {
        this.empresaPrestadorService.consultarFiliais().subscribe(res => {
            this.filiais = res;
        });
    }

    public adicionarFilial(filial) {
        this.formulario.get("filial").reset();
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
                this.filiaisAdd.push(this.filialDTO);
            }
        } else {
            this.formulario.get("filial").markAsTouched();
        }
    }

    public limparCampos(): void {
        this.formulario.reset();
        this.formulario.markAsPristine();
        this.formulario.markAsUntouched();
        this.formulario.updateValueAndValidity();
        this.filiaisAdd = [];
    }

    public removerFilial(index) {
        this.filiaisAdd.splice(index, 1);
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
            this.empresaPrestadorService.salvar(empresa).subscribe(() => {
                    this.showSuccessMsg(this.bundle(this.mensagemSucesso));
                    this.limparCampos();

                    this.retornarListaEmpresas();
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

    public retornarListaEmpresas() {
        return this.router.navigateByUrl("/manutencao/empresa-prestador-externo");
    }

    public excluirEmpresa(empresa) {
        this.messageService.addConfirmYesNo(this.bundle('MA021'), () => {
            this.empresaPrestadorService.excluirEmpresa(empresa.id).subscribe(() => {
                this.showSuccessMsg(this.bundle('MA039'));
                this.retornarListaEmpresas();
            }, err => this.showDangerMsg(err.error));
        }, null, null, 'Sim', 'Não');
    }
}
