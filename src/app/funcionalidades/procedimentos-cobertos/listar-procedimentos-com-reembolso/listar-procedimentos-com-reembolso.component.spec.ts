import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageService, PrestadorExternoService, ProcedimentoService } from 'app/shared/services/services';
import { of } from 'rxjs';
import { ListarProcedimentosComReembolsoComponent } from './listar-procedimentos-com-reembolso.component';

describe('ListarProcedimentosComReembolsoComponent', () => {
  let component: ListarProcedimentosComReembolsoComponent;
  let fixture: ComponentFixture<ListarProcedimentosComReembolsoComponent>;

  beforeEach(() => {
    const procedimentoServiceSpy = jasmine.createSpyObj('ProcedimentoService', ['listarProcedimentosComReembolso']);
    procedimentoServiceSpy.listarProcedimentosComReembolso.and.returnValue(of());
    const prestadorExternoServiceSpy = jasmine.createSpyObj('PrestadorExternoService',['get','consultarUsuarioExternoPorFiltro']);
    prestadorExternoServiceSpy.consultarUsuarioExternoPorFiltro = of({})

    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['showDangerMsg']);

    TestBed.configureTestingModule({
      declarations: [ ListarProcedimentosComReembolsoComponent ],
      providers: [
        {provide: ProcedimentoService, useValue: procedimentoServiceSpy },
        {provide: MessageService, useValue: messageServiceSpy },
        {provide: PrestadorExternoService, useValue: prestadorExternoServiceSpy }
      ],
      schemas: [
          CUSTOM_ELEMENTS_SCHEMA
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarProcedimentosComReembolsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
