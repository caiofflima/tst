import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { TipoBeneficiarioService } from 'app/shared/services/comum/tipo-beneficiario.service';
import { BeneficiarioPedidoService, ComboService, MessageService, PrestadorExternoService } from 'app/shared/services/services';
import { of } from 'rxjs';
import { PerfilService } from './../../../arquitetura/shared/services/seguranca/perfil.service';
import { BeneficiarioPedidoFormComponent } from './beneficiario-pedido-form.component';

describe('BeneficiarioPedidoFormComponent', () => {
  let component: BeneficiarioPedidoFormComponent;
  let fixture: ComponentFixture<BeneficiarioPedidoFormComponent>;
  const messageServiceSpy = jasmine.createSpyObj('MessageService',['getDescription']);
  const routerSpy = jasmine.createSpyObj('Router', ['navigate', 'url']);
  
  const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['snapshot']);
  activatedRouteSpy.snapshot = {
      params: {
        id: null
      }
    }
  
  const perfilServiceSpy = jasmine.createSpyObj('PerfilService', ['consultarPorNome']);
  
  const beneficiarioPedidoServiceSpy = jasmine.createSpyObj('BeneficiarioPedidoService', ['getTitulo','getBaseURL']);
   

  const tipoBeneficiarioServiceSpy = jasmine.createSpyObj('TipoBeneficiarioService', ['consultarTodosBeneficiarios']);
  const comboServiceSpy = jasmine.createSpyObj('ComboService', ['consultarComboUF','consultarComboPerfil']);
  const prestadorExternoServiceSpy = jasmine.createSpyObj('PrestadorExternoService',['get','consultarUsuarioExternoPorFiltro']);
  prestadorExternoServiceSpy.consultarUsuarioExternoPorFiltro = of({})
  comboServiceSpy.consultarComboPerfil.and.returnValue(of({}));


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BeneficiarioPedidoFormComponent],
      providers: [
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: PerfilService, useValue: perfilServiceSpy },
        { provide: BeneficiarioPedidoService, useValue: beneficiarioPedidoServiceSpy },
        { provide: TipoBeneficiarioService, useValue: tipoBeneficiarioServiceSpy },
  {provide: PrestadorExternoService, useValue: prestadorExternoServiceSpy },

        { provide: ComboService, useValue: comboServiceSpy },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficiarioPedidoFormComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

});