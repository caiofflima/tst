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
  const messageServiceSpy = { getDescription: jest.fn() };
  const routerSpy = { navigate: jest.fn(), url: jest.fn() };
  const activatedRouteSpy = { snapshot: jest.fn() };
  activatedRouteSpy.snapshot = {
    queryParams: {
      id: null
    }
  }
  const perfilServiceSpy = { consultarPorNome: jest.fn() };
  const beneficiarioPedidoServiceSpy = { getTitulo: jest.fn(), getBaseURL: jest.fn(), consultarPorFiltro: jest.fn() };
  beneficiarioPedidoServiceSpy.consultarPorFiltro.and.returnValue(of({}));
  beneficiarioPedidoServiceSpy.getTitulo.and.returnValue('Tipo de Beneficiário por Tipo de Pedido');
  beneficiarioPedidoServiceSpy.getBaseURL.and.returnValue('/manutencao/parametros/tipobeneficiario-tipopedido');
  
  const tipoBeneficiarioServiceSpy = { consultarTodosBeneficiarios: jest.fn() };
  const comboServiceSpy = { consultarComboUF: jest.fn(), consultarComboPerfil: jest.fn() };

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