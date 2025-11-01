import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutorizacaoPreviaService, BeneficiarioService, ComboService, DocumentoPedidoService, EmpresaPrestadorExternoService, MessageService, PrestadorExternoService } from 'app/shared/services/services';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { MeusDadosService } from 'app/shared/services/meus-dados/meus-dados.service';
import { AtendimentoService } from 'app/shared/services/comum/atendimento.service';
import { NovoPedidoAutorizadorComponent } from './novo-pedido-credenciado.component';
import { Data } from 'app/shared/providers/data';

describe('NovoPedidoAutorizadorComponent', () => {
  let component: NovoPedidoAutorizadorComponent;
  let fixture: ComponentFixture<NovoPedidoAutorizadorComponent>;
  const messageServiceSpy = jasmine.createSpyObj('MessageService',['getDescription']);
  const empresaPrestadorExternoServiceSpy = jasmine.createSpyObj('EmpresaPrestadorExternoService',['consultarEmpresaPorId', 'consultarFiliais']);
  const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute',['getDescription']);
  const routerSpy = jasmine.createSpyObj('Router',['getDescription']);
  const locationSpy = jasmine.createSpyObj('Location',['getDescription']);
  const meusDadosServiceSpy = jasmine.createSpyObj('ComboService',['carregarTitular']);
  const prestadorExternoServiceSpy = jasmine.createSpyObj('PrestadorExternoService',['get','consultarUsuarioExternoPorFiltro']);
  prestadorExternoServiceSpy.consultarUsuarioExternoPorFiltro = of({})
  empresaPrestadorExternoServiceSpy.consultarFiliais.and.returnValue(of({}));
  meusDadosServiceSpy.carregarTitular.and.returnValue(of({}));
 
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[
        FormsModule,  
        ReactiveFormsModule
      ],
      declarations: [NovoPedidoAutorizadorComponent],
      providers: [
        FormBuilder,
        Data,
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: EmpresaPrestadorExternoService, useValue: empresaPrestadorExternoServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: Router, useValue: routerSpy },
        { provide: Location, useValue: locationSpy },
        { provide: MeusDadosService, useValue: meusDadosServiceSpy },
        { provide: AtendimentoService, useValue: meusDadosServiceSpy },
        { provide: BeneficiarioService, useValue: meusDadosServiceSpy },
  {provide: PrestadorExternoService, useValue: prestadorExternoServiceSpy },

        { provide: AutorizacaoPreviaService, useValue: meusDadosServiceSpy },
      ]
    }).compileComponents();
    });

  beforeEach(() => {
    fixture = TestBed.createComponent(NovoPedidoAutorizadorComponent);

    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

});