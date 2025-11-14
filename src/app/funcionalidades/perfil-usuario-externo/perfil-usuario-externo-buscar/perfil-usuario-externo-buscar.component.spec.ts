import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Data } from 'app/shared/providers/data';
import { PerfilUsuarioExternoService } from 'app/shared/services/comum/perfil-usuario-externo.service';
import { ComboService, MessageService, PrestadorExternoService } from 'app/shared/services/services';
import { of } from 'rxjs';
import { PerfilUsuarioExternoBuscarComponent } from './perfil-usuario-externo-buscar.component';

describe('PerfilUsuarioExternoBuscarComponent', () => {
  let component: PerfilUsuarioExternoBuscarComponent;
  let fixture: ComponentFixture<PerfilUsuarioExternoBuscarComponent>;

  beforeEach(() => {
    const messageServiceSpy = { showDangerMsg: jest.fn() };
    const comboServiceSpy = { consultarComboPerfisPrestadoresExternos: jest.fn(), consultarComboTiposAuditor: jest.fn() };
    comboServiceSpy.consultarComboPerfisPrestadoresExternos.mockReturnValue(of());
    comboServiceSpy.consultarComboTiposAuditor.mockReturnValue(of());
    const prestadorExternoServiceSpy = { get: jest.fn(), consultarUsuarioExternoPorFiltro: jest.fn() };
    prestadorExternoServiceSpy.consultarUsuarioExternoPorFiltro.mockReturnValue(of({})
    const perfilUsuarioExternoServiceSpy = { consultarComboPerfisPrestadoresExternos: jest.fn(), consultarComboTiposAuditor: jest.fn(), consultarPorFiltro: jest.fn(), removerCredenciais: jest.fn()) };
    perfilUsuarioExternoServiceSpy.consultarPorFiltro.mockReturnValue(of());
    
    const dataSpy = { storage: jest.fn() };

    TestBed.configureTestingModule({
      declarations: [ PerfilUsuarioExternoBuscarComponent ],
      providers: [
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: ComboService, useValue: comboServiceSpy },
        { provide: PerfilUsuarioExternoService, useValue: perfilUsuarioExternoServiceSpy },
        { provide: Data, useValue: dataSpy },
    {provide: PrestadorExternoService, useValue: prestadorExternoServiceSpy }

      ],
      schemas: [
          CUSTOM_ELEMENTS_SCHEMA
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilUsuarioExternoBuscarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
