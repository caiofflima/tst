import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComboService, DocumentoPedidoService, EmpresaPrestadorExternoService, MessageService, PrestadorExternoService, SessaoService } from 'app/shared/services/services';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { Data } from 'app/shared/providers/data';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EmpresaPrestadorExternoListarComponent } from './empresa-prestador-externo-listar.component';
import { CampoVazioHifen } from 'app/shared/pipes/campo-vazio.pipe';
import { CnpjPipe } from 'app/shared/pipes/cnpj.pipe';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('EmpresaPrestadorExternoListarComponent', () => {
  
  let component: EmpresaPrestadorExternoListarComponent;
  let fixture: ComponentFixture<EmpresaPrestadorExternoListarComponent>;
  const messageServiceSpy = { getDescription: jest.fn() };
  const empresaPrestadorExternoServiceSpy = { consultarPorFiltro: jest.fn(), consultarFiliais: jest.fn() };
  const activatedRouteSpy = { getDescription: jest.fn() , snapshot: null, paramMap: of({}) };
  const routerSpy = { getDescription: jest.fn() };
  const locationSpy = { getDescription: jest.fn() };
  const comboServiceSpy = { consultarComboUF: jest.fn() };
  const empresaerviceSpy = { consultarPorFiltro: jest.fn() };
  const prestadorExternoServiceSpy = { get: jest.fn(), consultarUsuarioExternoPorFiltro: jest.fn() };
  prestadorExternoServiceSpy.consultarUsuarioExternoPorFiltro.mockReturnValue(of({}));
  empresaPrestadorExternoServiceSpy.consultarPorFiltro.mockReturnValue(of({}));
  comboServiceSpy.consultarComboUF.mockReturnValue(of({}));
  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports:[
        FormsModule,  
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      declarations: [EmpresaPrestadorExternoListarComponent,
        CampoVazioHifen,
        CnpjPipe
      ],
      providers: [
        FormBuilder,
        Data,
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: SessaoService, useValue: messageServiceSpy },
        { provide: EmpresaPrestadorExternoService, useValue: empresaPrestadorExternoServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: Router, useValue: routerSpy },
        { provide: Location, useValue: locationSpy },
  {provide: PrestadorExternoService, useValue: prestadorExternoServiceSpy },

        { provide: ComboService, useValue: comboServiceSpy },
      ],
      schemas: [
          CUSTOM_ELEMENTS_SCHEMA
      ]
    }).compileComponents();
    });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpresaPrestadorExternoListarComponent);

    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

});