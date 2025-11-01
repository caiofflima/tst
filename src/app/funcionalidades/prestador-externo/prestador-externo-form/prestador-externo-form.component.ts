import {AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {BaseComponent} from "app/shared/components/base.component";
import {MessageService} from "app/shared/components/messages/message.service";
import {PrestadorExterno} from "app/shared/models/comum/prestador-externo";
import { EmpresaPrestadora } from "app/shared/models/entidades";
import {PrestadorExternoService} from "app/shared/services/comum/prestador-externo.service";
import {CPF_MASK} from "app/shared/util/masks";
import {EmpresaPrestadorExternoService} from "app/shared/services/comum/empresa-prestador-externo.service";
import {AscValidators} from "app/shared/validators/asc-validators";

import {Calendar} from "primeng/calendar";
import {CalendarLocalePt} from "app/shared/util/calendar-locale-pt";

import {ComboService} from 'app/shared/services/comum/combo.service';
import {Util} from "../../../arquitetura/shared/util/util";
import {Location} from "@angular/common";
import {take} from "rxjs/operators";

@Component({
    selector: "app-prestador-externo-form",
    templateUrl: "./prestador-externo-form.component.html",
    styleUrls: ["./prestador-externo-form.component.scss"]
})

export class PrestadorExternoFormComponent extends BaseComponent implements OnInit, AfterViewInit {

    @ViewChild("dtNascimento")
    dtNascimento: Calendar;
    @ViewChild("dtLimitePrestadorExterno")
    dtLimitePrestadorExterno: Calendar;

    @Input()
    dateFormat: string;
    @Input()
    yearNavigator: boolean;
    @Input()
    monthNavigator: boolean;
    pt: any;

    form: FormGroup;
    formEmpresaPerfil: FormGroup;
    maskCpf: Array<string | RegExp> = null;
    prestadorExterno: PrestadorExterno = new PrestadorExterno();
    empresas: any[];
    perfisEmpresas: any[] = [];
    perfisEmpresasRemover: any[] = [];

    mensagemSucesso: string;
    perfis: any[];
    tiposAuditores: any[];

    id = this.fb.control(null);
    cpf = this.fb.control(null, [AscValidators.cpf]);
    nome = this.fb.control(null, [Validators.required]);
    email = this.fb.control(null, [AscValidators.email()]);
    atuacaoPrestadorExterno = this.fb.control(null, [Validators.required]);
    perfilPrestadorExterno = this.fb.control(null, [Validators.required]);

    constructor(
        override readonly messageService: MessageService,
        private readonly empresaService: EmpresaPrestadorExternoService,
        private readonly fb: FormBuilder,
        private readonly prestadorExternoService: PrestadorExternoService,
        private readonly comboService: ComboService,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly location: Location,
        private readonly ref: ChangeDetectorRef
    ) {
        super(messageService);
        this.id = this.route.snapshot.params["id"];

        this.formEmpresaPerfil = this.fb.group({
            empresaPrestadorExterno: [
                this.prestadorExterno.empresaPrestadorExterno,
                Validators.required
            ],
            perfilPrestadorExterno: this.perfilPrestadorExterno,
            atuacaoPrestadorExterno: this.atuacaoPrestadorExterno,
            dataLimitePrestadorExterno: [
                this.prestadorExterno.dataLimitePrestadorExterno,
                Validators.required
            ]
        });

        this.form = this.fb.group({
            id: this.id,
            cpf: this.cpf,
            nome: this.nome,
            email: this.email,
            codigoUsuario: [this.prestadorExterno.codigoUsuario],
            matriculaCadastramento: [this.prestadorExterno.matriculaCadastramento],
            dataCadastramento: [this.prestadorExterno.dataCadastramento],
            dataNascimento: [
                this.prestadorExterno.dataNascimento,
                Validators.required
            ]

        });

        this.maskCpf = CPF_MASK;
        this.buscarEmpresas();
        this.buscarPerfis();
        this.buscarTipoAuditor();

        this.pt = new CalendarLocalePt();
        this.dateFormat = "dd/mm/yy"
        this.yearNavigator = true;
        this.monthNavigator = true;
    }

    private consultaEstadoInicialPrestadorExterno(): void {
        if (this.id) {
            this.prestadorExternoService
                .consultarPorId(this.route.snapshot.params["id"]).pipe(take<PrestadorExterno>(1))
                .subscribe(res => {
                    this.perfisEmpresas = [];
                    res.empresas.forEach((item) => {
                        let usuarioEmpPerfil = {
                            atuacaoPrestadorExterno: item.atuacao,
                            perfilPrestadorExterno: item.perfil,
                            empresaPrestadorExterno: {
                                id: item.idempresa,
                                razaoSocial: item.empresa,
                                cnpj: item.cnpj,
                                contrato: item.contratoEmpresa,
                                dataCadastramento: item.dataCadastramentoEmpresa
                            },
                            dataLimitePrestadorExterno: Util.getDate(item.datalimite),
                        };
                        this.perfisEmpresas.push(usuarioEmpPerfil);
                    });

                    this.prestadorExterno = res;
                    this.prestadorExterno.nome = this.prestadorExterno.nome.toUpperCase();
                    this.prestadorExterno.dataNascimento = Util.getDate(this.prestadorExterno.dataNascimento);
                    this.prestadorExterno.empresas = [];
                    this.perfilPrestadorExterno.setValue(this.prestadorExterno.perfilPrestadorExterno);
                    this.atuacaoPrestadorExterno.setValue(this.prestadorExterno.atuacaoPrestadorExterno);
                    PrestadorExternoFormComponent.setValuesForm(this.form, this.prestadorExterno);
                });
        }
    }

    ngOnInit() {
        this.pt = new CalendarLocalePt();
        this.consultaEstadoInicialPrestadorExterno();
        this.atuacaoPrestadorExterno.disable();
        this.perfilPrestadorExterno.valueChanges.subscribe(() => {
            if (this.perfilPrestadorExterno.value == "ASC001") {
                this.atuacaoPrestadorExterno.enable();
            } else {
                this.atuacaoPrestadorExterno.reset();
                this.atuacaoPrestadorExterno.disable();
            }
        });
    }

    ngAfterViewInit() {
        this.inputDateMask(this.dtNascimento);
        this.inputDateMask(this.dtLimitePrestadorExterno);
        this.ref.detectChanges();
    }

    private static setValuesForm(formulario, prestadorExterno) {
        for (let key in prestadorExterno) {
            if (formulario.controls[key] != undefined) {
                formulario.controls[key].setValue(prestadorExterno[key]);
            }
        }
    }

    public salvar(): void {
        this.formControls();

        if (this.form.valid && this.perfisEmpresas.length > 0) {

            this.formEmpresaPerfil.controls['empresaPrestadorExterno'].setValue(null);
            this.formEmpresaPerfil.controls['perfilPrestadorExterno'].setValue(null);
            this.formEmpresaPerfil.controls['atuacaoPrestadorExterno'].setValue(null);
            this.formEmpresaPerfil.controls['dataLimitePrestadorExterno'].setValue(null);

            let idade = this.calculaIdade(this.form.controls['dataNascimento'].value);
            let erroData = false;

            this.perfisEmpresas.forEach(item => {
                if (this.form.controls['dataNascimento'].value > item.dataLimitePrestadorExterno) {
                    erroData = true;
                }
            });

            if (erroData) {
                this.showDangerMsg("Data de nascimento deve ser menor que a data limite..");
            } else {
                if (Number(idade) < Number(18)) {
                    this.showDangerMsg("Usuário deve ser maior de 18 anos.");
                } else {
                    let qtdGrupo = this.qtdGrupoPerfilUsuario();

                    if (qtdGrupo === 1) {
                        let prestadorExterno = this.cleanObjForm(this.form.value);
                        let eNovo;

                        if (prestadorExterno.id == null) {
                            eNovo = this.prestadorExternoService.consultarPorCPF(prestadorExterno.cpf);
                        } else {
                            eNovo = this.prestadorExternoService.consultarPorCpfAlteracao(prestadorExterno.cpf, prestadorExterno.id);
                        }

                        eNovo.subscribe(res => {
                            if (res) {
                                this.showDangerMsg("CPF já resgistrado na base de dados.");
                            } else {
                                this.mensagemSucesso = this.form.get("id").value != null ? "MA022" : "MA038";

                                this.prestadorExternoService.salvar(prestadorExterno).subscribe(async () => {
                                        this.showSuccessMsg(this.bundle(this.mensagemSucesso));
                                        if (prestadorExterno.id == null) {
                                            await this.router.navigateByUrl("/seguranca/prestador-externo");
                                        }
                                    }, err => this.showDangerMsg(err.error)
                                );
                            }
                        });
                    } else {
                        this.showDangerMsg("Perfis adicionados pertencem a grupos incompatíveis.");
                    }
                }
            }
        } else {
            if (this.form.valid && this.perfisEmpresas.length <= 0) {
                this.showDangerMsg("Deve ser adicionada pelo menos uma Empresa/Perfil");
            }

            this.validateAllFormFields(this.form);
        }
    }

    public formControls(): void {
        if (this.perfisEmpresas.length > 0) {
            this.formEmpresaPerfil.controls['empresaPrestadorExterno'].setValue(this.perfisEmpresas[0].empresaPrestadorExterno.id);
            this.formEmpresaPerfil.controls['perfilPrestadorExterno'].setValue(this.perfisEmpresas[0].perfilPrestadorExterno);
            this.formEmpresaPerfil.controls['atuacaoPrestadorExterno'].setValue(this.perfisEmpresas[0].atuacaoPrestadorExterno);
            this.formEmpresaPerfil.controls['dataLimitePrestadorExterno'].setValue(this.perfisEmpresas[0].dataLimitePrestadorExterno);
        }
    }

    public limparCampos(): void {
        this.form.reset();
        this.formEmpresaPerfil.reset();
        this.perfisEmpresas = [];
    }

    public buscarEmpresas() {
        this.empresaService.buscarEmpresas().subscribe(empresas => {
            this.empresas = this.tratarComboEmpresa(empresas);
        });
    }

    private tratarComboEmpresa(res: EmpresaPrestadora[]): EmpresaPrestadora[] {
        return res.map(empresa => ({
            ...empresa,
            razaoSocial: empresa.razaoSocial ? empresa.razaoSocial.toUpperCase() : ''
        }));
    }

    public buscarPerfis() {
        this.comboService.consultarComboPerfisPrestadoresExternos().subscribe(perfis => {
            this.perfis = perfis;
        });
    }

    public buscarTipoAuditor() {
        this.comboService.consultarComboTiposAuditor().subscribe(tiposAuditores => {
            this.tiposAuditores = tiposAuditores;
        });
    }

    public adicionarPerfilEmpresa() {
        if (this.formEmpresaPerfil.valid) {
            if (this.perfisEmpresas == undefined) {
                this.perfisEmpresas = [];
            }
            this.perfisEmpresas.push(this.formEmpresaPerfil.value);
            this.limpaCamposPerfilEmpresa();
        } else {
            this.markFormTouched();
        }
    }

    public markFormTouched() {
        if (this.formEmpresaPerfil.get('empresaPrestadorExterno').invalid) {
            this.formEmpresaPerfil.get('empresaPrestadorExterno').markAsTouched();
        }

        if (this.formEmpresaPerfil.get('perfilPrestadorExterno').invalid) {
            this.formEmpresaPerfil.get('perfilPrestadorExterno').markAsTouched();
        }

        if (this.formEmpresaPerfil.get('atuacaoPrestadorExterno').invalid) {
            this.formEmpresaPerfil.get('atuacaoPrestadorExterno').markAsTouched();
        }

        if (this.formEmpresaPerfil.get('dataLimitePrestadorExterno').invalid) {
            this.formEmpresaPerfil.get('dataLimitePrestadorExterno').markAsTouched();
        }
    }

    public limpaCamposPerfilEmpresa() {
        this.formEmpresaPerfil.get('empresaPrestadorExterno').reset('');
        this.formEmpresaPerfil.get('perfilPrestadorExterno').reset('');
        this.formEmpresaPerfil.get('atuacaoPrestadorExterno').reset('');
        this.formEmpresaPerfil.get('dataLimitePrestadorExterno').reset('');
    }

    public removerPerfilEmpresa(index) {
        this.perfisEmpresas.forEach((item, ind) => {
            if (ind == index) {
                this.perfisEmpresasRemover.push(item);
            }
        });
        this.perfisEmpresas.splice(index, 1);
    }

    public alterarStatus() {
        let status = this.prestadorExterno.ativo == 'S' ? 'N' : 'S';
        let msgStatus = this.prestadorExterno.ativo == 'S' ? 'Inativação' : 'Ativação';
        this.messageService.addConfirmYesNo(this.bundle('MA103', msgStatus), (): void => {
            this.prestadorExternoService.alterarStatus(this.prestadorExterno.id, status).subscribe(() => {
                this.messageService.addMsgSuccess(this.bundle('MA104', msgStatus));

                if (this.prestadorExterno.ativo == 'S') {
                    this.prestadorExterno.ativo = 'N';
                } else {
                    this.prestadorExterno.ativo = 'S';
                }
            }, () => {
                this.messageService.addMsgDanger('Ocorreu um erro ao alterar a situação do usuário.');
            });
        }, null, null, 'Sim', 'Não');
    }

    public cleanObjForm(obj) {
        let empPerfil = [];

        delete obj.atuacaoPrestadorExterno;
        delete obj.perfilPrestadorExterno;
        delete obj.dataLimitePrestadorExterno;
        delete obj.empresaPrestadorExterno;

        this.perfisEmpresas.forEach((item, index) => {
            let atuacao = (item.atuacaoPrestadorExterno === undefined) ? null : item.atuacaoPrestadorExterno;
            empPerfil[index] = {
                'idempresa': item.empresaPrestadorExterno.id,
                'perfil': item.perfilPrestadorExterno,
                'atuacao': atuacao,
                'datalimite': item.dataLimitePrestadorExterno
            }
        });

        obj.empresas = empPerfil;
        obj.cpf = obj.cpf.replace("-", "").replace(/\./g, "");
        return obj;
    }

    public grupoPerfil() {
        return {
            'ASC001': 'A',
            'ASC002': 'A',
            'ASC009': 'B',
            'ASC003': 'C',
            'ASC008': 'D',
        };
    }

    public qtdGrupoPerfilUsuario() {
        let grupoPerfil = this.grupoPerfil();
        let tmpPerfilUsuario = [];
        let aGrupoPerfil;
        let count = 0;

        this.perfisEmpresas.forEach((item) => {
            aGrupoPerfil = grupoPerfil[item.perfilPrestadorExterno];
            if (!tmpPerfilUsuario[aGrupoPerfil]) {
                tmpPerfilUsuario[aGrupoPerfil] = item.perfilPrestadorExterno;
                count = count + 1;
            }
        });

        return count;
    }

    public calculaIdade(nascimento) {
        let hoje = new Date();
        return Math.floor(Math.ceil(Math.abs(nascimento.getTime() - hoje.getTime()) / (1000 * 3600 * 24)) / 365.25);
    }


    public editarUsuario(usuario): void {
        this.router.navigateByUrl(
            "/seguranca/prestador-externo/editar/" + usuario.id
        );
    }

    voltar(): void {
        this.location.back();
    }

    public restaurarCampos(): void {
        this.consultaEstadoInicialPrestadorExterno();
    }
}
