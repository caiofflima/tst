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
  const messageServiceSpy = jasmine.createSpyObj('MessageService',['getDescription']);
  const empresaPrestadorExternoServiceSpy = jasmine.createSpyObj('EmpresaPrestadorExternoService',['consultarEmpresaPorId', 'consultarFiliais']);
  const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute',['getDescription']);
  const routerSpy = jasmine.createSpyObj('Router',['getDescription']);
  const locationSpy = jasmine.createSpyObj('Location',['getDescription']);
  const comboServiceSpy = jasmine.createSpyObj('ComboService',['consultarComboUF']);
  const prestadorExternoServiceSpy = jasmine.createSpyObj('PrestadorExternoService',['get','consultarUsuarioExternoPorFiltro']);
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