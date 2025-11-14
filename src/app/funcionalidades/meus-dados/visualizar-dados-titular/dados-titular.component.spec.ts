import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComboService, DocumentoPedidoService, EmpresaPrestadorExternoService, MessageService, PrestadorExternoService } from 'app/shared/services/services';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { DadosTitularComponent } from './dados-titular.component';
import { MeusDadosService } from 'app/shared/services/meus-dados/meus-dados.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('DadosTitularComponent', () => {
  let component: DadosTitularComponent;
  let fixture: ComponentFixture<DadosTitularComponent>;
  const messageServiceSpy = { getDescription: jest.fn() };
  const empresaPrestadorExternoServiceSpy = { consultarEmpresaPorId: jest.fn(), consultarFiliais: jest.fn() };
  const activatedRouteSpy = { getDescription: jest.fn() , snapshot: null, paramMap: jest.fn() };
  const routerSpy = { getDescription: jest.fn() };
  const locationSpy = { getDescription: jest.fn() };
  const meusDadosServiceSpy = { carregarTitular: jest.fn() };
  const prestadorExternoServiceSpy = { get: jest.fn(), consultarUsuarioExternoPorFiltro: jest.fn() };
  prestadorExternoServiceSpy.consultarUsuarioExternoPorFiltro.mockReturnValue(of({});
  empresaPrestadorExternoServiceSpy.consultarFiliais.mockReturnValue(of({}));
  meusDadosServiceSpy.carregarTitular.mockReturnValue(of({}));
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[
        FormsModule,  
        ReactiveFormsModule
      ],
      declarations: [DadosTitularComponent],
      providers: [
        FormBuilder,
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: EmpresaPrestadorExternoService, useValue: empresaPrestadorExternoServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: Router, useValue: routerSpy },
        { provide: Location, useValue: locationSpy },
  {provide: PrestadorExternoService, useValue: prestadorExternoServiceSpy },

        { provide: MeusDadosService, useValue: meusDadosServiceSpy },
      ],
      schemas: [
          CUSTOM_ELEMENTS_SCHEMA
      ]
    }).compileComponents();
    });

  beforeEach(() => {
    fixture = TestBed.createComponent(DadosTitularComponent);

    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

});