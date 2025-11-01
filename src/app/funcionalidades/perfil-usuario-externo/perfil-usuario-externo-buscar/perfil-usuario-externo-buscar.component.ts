import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {BaseComponent} from 'app/shared/components/base.component';
import {MessageService} from 'app/shared/components/messages/message.service';
import {cpfUtil} from 'app/shared/constantes';
import {PerfilPrestadorEmpresaDTO} from 'app/shared/models/dto/perfil-prestador-empresa';
import {FiltroConsultaPerfilUsuarioExterno} from 'app/shared/models/filtro/filtro-consulta-perfil-usuario-externo';
import {Data} from 'app/shared/providers/data';
import {PerfilUsuarioExternoService} from 'app/shared/services/comum/perfil-usuario-externo.service';
import {ComboService} from 'app/shared/services/comum/combo.service';
import {PerfilPrestadorEmpresaSaveDTO} from 'app/shared/models/dto/perfil-prestador-empresa-save';
import { CPF_MASK } from 'app/shared/util/masks';

@Component({
  selector: 'app-perfil-usuario-externo-buscar',
  templateUrl: './perfil-usuario-externo-buscar.component.html',
  styleUrls: ['./perfil-usuario-externo-buscar.component.scss']
})
export class PerfilUsuarioExternoBuscarComponent extends BaseComponent implements OnInit {
  
  @ViewChild('caixaTablePerfilUsuarioExternoBuscar')caixaTablePerfilUsuarioExternoBuscar:any
  registrosSelecionados: any[];
  listaPerfisUsuarios: any[];
  filtro: FiltroConsultaPerfilUsuarioExterno;
  perfisPrestadoresEmpresas: any[] = [];
  perfis: any[] = [];
  tiposAuditores: any[] = [];
  perfilPrestadorDtoSave: PerfilPrestadorEmpresaSaveDTO = new PerfilPrestadorEmpresaSaveDTO();
  maskCpf: Array<string | RegExp> = null;

  constructor(messageService: MessageService,
              private comboService: ComboService,
              private router: Router,
              private perfilUsuarioExternoService: PerfilUsuarioExternoService,
              private data: Data) {
    super(messageService);
    this.comboService.consultarComboPerfisPrestadoresExternos().subscribe(res => this.perfis = res, error => this.showDangerMsg(error.error));
    this.comboService.consultarComboTiposAuditor().subscribe(res => this.tiposAuditores = res, error => this.showDangerMsg(error.error));
    if (this.data.storage) {
      if (this.data.storage.filtroPerfilUsuarioEmpresa) {
        this.filtro = this.data.storage.filtroPerfilUsuarioEmpresa;
      } else {
        this.filtro = new FiltroConsultaPerfilUsuarioExterno();
      }

      this.consultarPerfisUsuarios(this.filtro);
    }

    this.maskCpf = CPF_MASK;
  }

  ngOnInit() {
   // no aguardo de funcionalidades  
  }
  applyGlobalFilter(evento:Event){
    const input = evento.target as HTMLInputElement
    const value = input.value
    this.caixaTablePerfilUsuarioExternoBuscar.filterGlobal(value,'contains')
}

  public atualizarCredencial(): void {
    if (this.perfisPrestadoresEmpresas.length == 0) {
      this.showDangerMsg(this.bundle('MA100', 'alteração'));
    } else {
      this.data.storage = {
        perfisPrestadoresEmpresas: this.perfisPrestadoresEmpresas,
        perfis: this.perfis,
        tiposAuditores: this.tiposAuditores
      };
      this.router.navigateByUrl('/seguranca/perfil-usuario-externo/atualizar-credencial');
    }
  }

  consultarPerfisUsuarios(filtro): void {
    if (filtro.empresa != null) {
      filtro.empresa = filtro.empresa.id;
    }
    if (filtro.cpf != null) {
      filtro.cpf = cpfUtil.limparFormatacao(filtro.cpf);
    }
    this.perfilUsuarioExternoService.consultarPorFiltro(filtro).subscribe(res => {
      this.listaPerfisUsuarios = res;
    });
  }

  removerCredencial(): void {
    if (this.perfisPrestadoresEmpresas.length == 0) {
      this.showDangerMsg(this.bundle('MA100', 'remoção'));
    } else {
      this.messageService.addConfirmYesNo(this.bundle('MA092'), () => {
        this.perfilUsuarioExternoService.removerCredenciais(this.perfisPrestadoresEmpresas).subscribe(() => {
          this.messageService.addMsgSuccess(this.bundle('MA039'));
          this.consultarPerfisUsuarios(this.filtro);
          this.data.reset();
          this.perfisPrestadoresEmpresas = [];
        }, () => {
          this.messageService.addMsgDanger('Ocorreu um erro ao remover as credenciais do usuário.');
        });
      }, null, null, 'Sim', 'Não');
    }
  }

  voltar(): void {
    this.router.navigateByUrl('seguranca/perfil-usuario-externo');
  }

  selecionarPerfis(event) {
    let perfilPrestadoresEmp: PerfilPrestadorEmpresaDTO = new PerfilPrestadorEmpresaDTO();
    perfilPrestadoresEmp.empresa = event.data.idEmpresa;
    perfilPrestadoresEmp.perfil = event.data.codigoPerfil;
    perfilPrestadoresEmp.prestador = event.data.id;
    perfilPrestadoresEmp.atuacaoProfissional = event.data.idAtuacaoProfissional;
    perfilPrestadoresEmp.dataLimite = event.data.dataLimite;
    perfilPrestadoresEmp.naoCadastrar = true;
    perfilPrestadoresEmp.removerPerfil = false;

    this.perfisPrestadoresEmpresas.push(perfilPrestadoresEmp);

  }

  deSelecionarPerfis(event) {
    this.perfisPrestadoresEmpresas.forEach(perfilPrestador => {
      if (perfilPrestador.empresa == event.data.idEmpresa && perfilPrestador.perfil == event.data.codigoPerfil
        && perfilPrestador.prestador == event.data.id) {
        this.perfisPrestadoresEmpresas.splice(perfilPrestador, 1);
      }
    });
  }
}
