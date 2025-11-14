import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListarProcedimentosComReembolsoComponent } from '../procedimentos-cobertos/listar-procedimentos-com-reembolso/listar-procedimentos-com-reembolso.component';
import { ComboService, DocumentoTipoProcessoService, MessageService, ProcedimentoService, TipoDeficienciaService } from 'app/shared/services/services';
import { DuvidasService } from 'app/shared/services/comum/duvidas.service';
import { of } from 'rxjs';

describe('ListarProcedimentosComReembolsoComponent', () => {
  let component: ListarProcedimentosComReembolsoComponent;
  let fixture: ComponentFixture<ListarProcedimentosComReembolsoComponent>;
  let messageServiceSpy = { get: jest.fn() };
  let tipoDeficienciaServiceSpy = { get: jest.fn() };
  let comboServiceSpy = { get: jest.fn() };
  let documentoTipoProcessoServiceSpy = { get: jest.fn() };
  let duvidasServiceSpy = { get: jest.fn() };
  let procedimentoServiceSpy = { listarProcedimentosComReembolso: jest.fn() };
  procedimentoServiceSpy.listarProcedimentosComReembolso.mockReturnValue(of([]));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarProcedimentosComReembolsoComponent ],
      providers:[
        {provide: MessageService, useValue: messageServiceSpy},
        {provide: TipoDeficienciaService, useValue: tipoDeficienciaServiceSpy},
        {provide: ComboService, useValue: comboServiceSpy},
        {provide: DocumentoTipoProcessoService, useValue: documentoTipoProcessoServiceSpy},
        {provide: DuvidasService, useValue: duvidasServiceSpy},
        {provide: ProcedimentoService, useValue: procedimentoServiceSpy},
      ]
    }).compileComponents();
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
