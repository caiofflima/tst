import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { BaseComponent } from "app/shared/components/base.component";
import { MessageService } from "app/shared/components/messages/message.service";
import { FiltroConsultaPerfilUsuarioExterno } from "app/shared/models/filtro/filtro-consulta-perfil-usuario-externo";
import { Data } from "app/shared/providers/data";
import { EmpresaPrestadorExternoService } from "app/shared/services/comum/empresa-prestador-externo.service";
import { PerfilUsuarioExternoService } from "app/shared/services/comum/perfil-usuario-externo.service";
import { ComboService } from "app/shared/services/comum/combo.service";
import { FormBuilder, FormGroup, AbstractControl } from "@angular/forms";
import { CPF_MASK } from "app/shared/util/masks";
import { CalendarLocalePt } from "app/shared/util/calendar-locale-pt";

@Component({
  selector: "app-perfil-usuario-externo-home",
  templateUrl: "./perfil-usuario-externo-home.component.html",
  styleUrls: ["./perfil-usuario-externo-home.component.scss"]
})
export class PerfilUsuarioExternoHomeComponent extends BaseComponent
  implements OnInit {
  form: FormGroup;
  perfis: any[];
  tiposAuditores: any[];
  empresas: any[];
  maskCpf: string = null;
  filtro: FiltroConsultaPerfilUsuarioExterno;
  pt: any;

  constructor(
    protected override messageService: MessageService,
    private fb: FormBuilder,
    private comboService: ComboService,
    private empresaService: EmpresaPrestadorExternoService,
    private router: Router,
    private data: Data
  ) {
    super(messageService);

    this.maskCpf = CPF_MASK;
    this.initForm();
    this.filtro = new FiltroConsultaPerfilUsuarioExterno();
    if (this.data.storage && this.data.storage.filtro) {
      this.filtro = this.data.storage.filtro;
    }
  }

  ngOnInit() {
    this.pt = new CalendarLocalePt();
    this.comboService.consultarComboPerfisPrestadoresExternos().subscribe(res => this.perfis = res, error => this.showDangerMsg(error.error));
    this.comboService.consultarComboTiposAuditor().subscribe(res => this.tiposAuditores = res, error => this.showDangerMsg(error.error));
    this.empresaService.buscarEmpresas().subscribe(res => {
      this.empresas = res;
    });
    this.idTipoAuditor.disable();
    this.codigoPerfil.valueChanges.subscribe(next => {
      if (this.codigoPerfil.value == "ASC001") {
        this.idTipoAuditor.enable();
      } else {
        this.idTipoAuditor.reset();
        this.idTipoAuditor.disable();
      }
    });
  }

  private initForm(): void {
    this.form = this.fb.group({
      codigoPerfil: this.fb.control(''),
      idTipoAuditor: this.fb.control(''),
      cpf: this.fb.control(''),
      empresa: this.fb.control(''),
      dataLimiteInicial: this.fb.control(''),
      dataLimiteFinal: this.fb.control(''),
    }
    );
  }

  get codigoPerfil(): AbstractControl {
    return this.form.get('codigoPerfil')
  }

  get idTipoAuditor(): AbstractControl {
    return this.form.get('idTipoAuditor')
  }

  get cpf(): AbstractControl {
    return this.form.get('cpf')
  }

  get idEmpresa(): AbstractControl {
    return this.form.get('empresa')
  }

  get dtLimiteInicial(): AbstractControl {
    return this.form.get('dataLimiteInicial')
  }

  get dtLimiteFinal(): AbstractControl {
    return this.form.get('dataLimiteFinal')
  }

  limparCampos() {
    this.form.reset();
  }

  pesquisarPerfisUsuarios() {
    this.data.storage.filtroPerfilUsuarioEmpresa = this.form.value;
    this.router.navigateByUrl('seguranca/perfil-usuario-externo/busca');
  }
}
