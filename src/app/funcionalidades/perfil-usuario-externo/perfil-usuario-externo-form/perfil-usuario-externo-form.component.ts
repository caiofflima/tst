import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {BaseComponent} from 'app/shared/components/base.component';
import {MessageService} from 'app/shared/components/messages/message.service';
import {PerfilEmpresaPrestadora} from 'app/shared/models/comum/perfil-empresa-prestadora';
import {PerfilPrestadorEmpresaSaveDTO} from 'app/shared/models/dto/perfil-prestador-empresa-save';
import {Data} from 'app/shared/providers/data';
import {PerfilUsuarioExternoService} from 'app/shared/services/comum/perfil-usuario-externo.service';
import {CalendarLocalePt} from 'app/shared/util/calendar-locale-pt';

@Component({
  selector: 'app-perfil-usuario-externo-form',
  templateUrl: './perfil-usuario-externo-form.component.html',
  styleUrls: ['./perfil-usuario-externo-form.component.scss']
})
export class PerfilUsuarioExternoFormComponent extends BaseComponent implements OnInit {

  pt: any;
  formulario: FormGroup;
  perfilEmpresaPrestador: PerfilEmpresaPrestadora = new PerfilEmpresaPrestadora();
  public perfis: any[];
  perfisEmpresas: any[] = [];
  perfisEmpresasRemover: any[] = [];
  public tiposAuditores: any[];
  perfilPrestadorDtoSave: PerfilPrestadorEmpresaSaveDTO = new PerfilPrestadorEmpresaSaveDTO();

  constructor(private formBuilder: FormBuilder,
              protected override messageService: MessageService,
              private perfilUsuarioExternoService: PerfilUsuarioExternoService,
              private router: Router,
              private data: Data
  ) {
    super(messageService);
    this.pt = new CalendarLocalePt()
    this.formulario = this.formBuilder.group({
      id: [this.perfilEmpresaPrestador.id],
      perfil: [this.perfilEmpresaPrestador.perfil, Validators.required],
      atuacaoProfissional: [this.perfilEmpresaPrestador.atuacaoProfissional],
      dataLimite: [this.perfilEmpresaPrestador.dataLimite, Validators.required],
      naoCadastrar: [false]
    });

    if (data.storage) {
      this.perfisEmpresas = data.storage.perfisPrestadoresEmpresas;
      this.perfis = data.storage.perfis;
      this.tiposAuditores = data.storage.tiposAuditores;
    }
  }

  ngOnInit() {
    this.atuacaoProfissional.disable();
    this.perfil.valueChanges.subscribe(() => {
      if (this.perfil.value == "ASC001") {
        this.atuacaoProfissional.enable();
      } else {
        this.atuacaoProfissional.reset();
        this.atuacaoProfissional.disable();
      }
    });
  }

  get perfil(): AbstractControl {
    return this.formulario.get('perfil')
  }

  get atuacaoProfissional(): AbstractControl {
    return this.formulario.get('atuacaoProfissional')
  }

  public limparCampos() {
    this.formulario.reset();
  }

  public salvar() {
    if(!this.validarEmpresas){
      this.markFormTouched();
      return
    }
      let prestadores: any[] = [];
      let empresas: any[] = [];
      this.perfilPrestadorDtoSave = new PerfilPrestadorEmpresaSaveDTO();
      this.data.storage.perfisPrestadoresEmpresas.forEach(element => {
        if (!prestadores.includes(element.prestador)) {
          prestadores.push(element.prestador);
        }
        if (!empresas.includes(element.empresa)) {
          empresas.push(element.empresa);
        }
      });

      empresas.forEach(empresa => {
        if (empresa != undefined) {
          prestadores.forEach(prestador => {
            if (prestador != undefined) {
              let prestadorEmpresa = {empresa: null, prestador: null};
              prestadorEmpresa.empresa = empresa;
              prestadorEmpresa.prestador = prestador;

              this.perfilPrestadorDtoSave.empresasPrestadores.push(prestadorEmpresa);
            }
          });
        }
      });
      this.perfilPrestadorDtoSave.perfis = this.perfisEmpresas;
      this.perfilPrestadorDtoSave.perfisRemover = this.perfisEmpresasRemover;
      this.perfilUsuarioExternoService.salvar(this.perfilPrestadorDtoSave).subscribe(() => {
        this.messageService.showSuccessMsg(this.bundle('MA022'))
        this.voltar();
      }, error => {
        this.messageService.showDangerMsg("Houve erro ao salvar ao atualizar as credenciais")
      });
      this.formulario.markAsUntouched();
 
  }

  validarEmpresas() {
    let valido = false;
    this.data.storage.perfisPrestadoresEmpresas.forEach(element => {
      if (element.perfil) {
        valido = true;
      }
    });

    return valido;
  }

  public removerPerfilEmpresa(index) {
    this.perfisEmpresas.forEach((item, ind) => {
      if (ind == index) {
        this.perfisEmpresasRemover.push(item);
      }
    });
    this.perfisEmpresas.splice(index, 1);
  }

  public adicionarPerfilEmpresa() {
    if (this.formulario.valid) {
      if (this.perfisEmpresas == undefined) {
        this.perfisEmpresas = [];
      }
      this.perfisEmpresas.push(this.formulario.value);
      this.formulario.reset();
    } else {
      this.markFormTouched();
    }
  }

  markFormTouched() {
    if (this.formulario.get('perfil').invalid)
      this.formulario.get('perfil').markAsTouched();
    if (this.formulario.get('atuacaoProfissional').invalid)
      this.formulario.get('atuacaoProfissional').markAsTouched();
    if (this.formulario.get('dataLimite').invalid)
      this.formulario.get('dataLimite').markAsTouched();
  }


  public voltar() {
    this.router.navigateByUrl('/seguranca/perfil-usuario-externo');
  }
}
