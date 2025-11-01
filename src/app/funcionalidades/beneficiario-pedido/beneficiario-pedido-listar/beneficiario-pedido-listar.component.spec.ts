import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { TipoBeneficiarioService } from 'app/shared/services/comum/tipo-beneficiario.service';
import { BeneficiarioPedidoService, ComboService, MessageService } from 'app/shared/services/services';
import { of } from 'rxjs';
import { PerfilService } from './../../../arquitetura/shared/services/seguranca/perfil.service';
import { BeneficiarioPedidoListarComponent } from './beneficiario-pedido-listar.component';


class MockUtil {
  static getDate(dateString: string): Date {
    return new Date(dateString);
  }
}

describe('BeneficiarioPedidoListarComponent', () => {
  let component: BeneficiarioPedidoListarComponent;
  let fixture: ComponentFixture<BeneficiarioPedidoListarComponent>;
  const messageServiceSpy = jasmine.createSpyObj('MessageService',['getDescription']);
  const routerSpy = jasmine.createSpyObj('Router', ['navigate', 'url']);
  const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['snapshot']);
  activatedRouteSpy.snapshot = {
    queryParams: {
      id: null
    }
  }
  const perfilServiceSpy = jasmine.createSpyObj('PerfilService', ['consultarPorNome']);
  const beneficiarioPedidoServiceSpy = jasmine.createSpyObj('BeneficiarioPedidoService', ['getTitulo','getBaseURL', 'consultarPorFiltro']);
  beneficiarioPedidoServiceSpy.consultarPorFiltro.and.returnValue(of({}));
  beneficiarioPedidoServiceSpy.getTitulo.and.returnValue('Tipo de Beneficiário por Tipo de Pedido');
  beneficiarioPedidoServiceSpy.getBaseURL.and.returnValue('/manutencao/parametros/tipobeneficiario-tipopedido');
  
  const tipoBeneficiarioServiceSpy = jasmine.createSpyObj('TipoBeneficiarioService', ['consultarTodosBeneficiarios']);
  const comboServiceSpy = jasmine.createSpyObj('ComboService', ['consultarComboUF','consultarComboPerfil']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BeneficiarioPedidoListarComponent],
      providers: [
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: PerfilService, useValue: perfilServiceSpy },
        { provide: BeneficiarioPedidoService, useValue: beneficiarioPedidoServiceSpy },
        { provide: TipoBeneficiarioService, useValue: tipoBeneficiarioServiceSpy },
        { provide: ComboService, useValue: comboServiceSpy },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficiarioPedidoListarComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

});