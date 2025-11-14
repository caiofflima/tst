import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Data } from 'app/shared/providers/data';
import { PerfilUsuarioExternoService } from 'app/shared/services/comum/perfil-usuario-externo.service';
import { MessageService, PrestadorExternoService } from 'app/shared/services/services';
import { of } from 'rxjs';
import { PerfilUsuarioExternoFormComponent } from './perfil-usuario-externo-form.component';

describe('PerfilUsuarioExternoFormComponent', () => {
  const messageServiceSpy = { showDangerMsg: jest.fn(), fromResourceBundle: jest.fn() };

  const perfilUsuarioExternoServiceSpy = { consultarComboPerfisPrestadoresExternos: jest.fn(), consultarComboTiposAuditor: jest.fn(), consultarPorFiltro: jest.fn(), removerCredenciais: jest.fn() };
  perfilUsuarioExternoServiceSpy.consultarPorFiltro.mockReturnValue(of());
    const prestadorExternoServiceSpy = { get: jest.fn(), consultarUsuarioExternoPorFiltro: jest.fn() };
    prestadorExternoServiceSpy.consultarUsuarioExternoPorFiltro = of({})
  const dataSpy = { storage: jest.fn() };

  let component: PerfilUsuarioExternoFormComponent;
  let fixture: ComponentFixture<PerfilUsuarioExternoFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ PerfilUsuarioExternoFormComponent ],
      providers: [
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: PerfilUsuarioExternoService, useValue: perfilUsuarioExternoServiceSpy },
           {provide: PrestadorExternoService, useValue: prestadorExternoServiceSpy },
        { provide: Data, useValue: dataSpy },
      ],
      schemas: [
          CUSTOM_ELEMENTS_SCHEMA,
          NO_ERRORS_SCHEMA
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilUsuarioExternoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
