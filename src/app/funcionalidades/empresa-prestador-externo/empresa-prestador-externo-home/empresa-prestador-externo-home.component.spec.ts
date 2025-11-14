import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComboService, DocumentoPedidoService, EmpresaPrestadorExternoService, MessageService, PrestadorExternoService, SessaoService } from 'app/shared/services/services';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { EmpresaPrestadorExternoHomeComponent } from './empresa-prestador-externo-home.component';
import { Data } from 'app/shared/providers/data';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Usuario } from 'app/shared/models/entidades';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


describe('EmpresaPrestadorExternoHomeComponent', () => {
  
  let component: EmpresaPrestadorExternoHomeComponent;
  let fixture: ComponentFixture<EmpresaPrestadorExternoHomeComponent>;
  const messageServiceSpy = { getDescription: jest.fn() };
  const empresaPrestadorExternoServiceSpy = { consultarEmpresaPorId: jest.fn(), consultarFiliais: jest.fn() };
  const activatedRouteSpy = { getDescription: jest.fn() };
  const routerSpy = { getDescription: jest.fn() };
  const locationSpy = { getDescription: jest.fn() };
  const comboServiceSpy = { consultarComboUF: jest.fn() };
  const prestadorExternoServiceSpy = { get: jest.fn(), consultarUsuarioExternoPorFiltro: jest.fn() };
  prestadorExternoServiceSpy.consultarUsuarioExternoPorFiltro = of({})
  empresaPrestadorExternoServiceSpy.consultarFiliais.and.returnValue(of({}));
  comboServiceSpy.consultarComboUF.and.returnValue(of({}));

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports:[
        FormsModule,  
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      declarations: [EmpresaPrestadorExternoHomeComponent],
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
    fixture = TestBed.createComponent(EmpresaPrestadorExternoHomeComponent);

    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

});