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
    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['showDangerMsg']);
    const comboServiceSpy = jasmine.createSpyObj('ComboService', ['consultarComboPerfisPrestadoresExternos', 'consultarComboTiposAuditor']);
    comboServiceSpy.consultarComboPerfisPrestadoresExternos.and.returnValue(of());
    comboServiceSpy.consultarComboTiposAuditor.and.returnValue(of());
    const prestadorExternoServiceSpy = jasmine.createSpyObj('PrestadorExternoService',['get','consultarUsuarioExternoPorFiltro']);
    prestadorExternoServiceSpy.consultarUsuarioExternoPorFiltro = of({})
    const perfilUsuarioExternoServiceSpy = jasmine.createSpyObj('ComboService', ['consultarComboPerfisPrestadoresExternos', 'consultarComboTiposAuditor', 'consultarPorFiltro', 'removerCredenciais']);
    perfilUsuarioExternoServiceSpy.consultarPorFiltro.and.returnValue(of());
    
    const dataSpy = jasmine.createSpyObj('Data', ['storage']);

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
