import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ListarProcedimentosComReembolsoComponent } from '../procedimentos-cobertos/listar-procedimentos-com-reembolso/listar-procedimentos-com-reembolso.component';
import { ComboService, DocumentoTipoProcessoService, MessageService, ProcedimentoService, TipoDeficienciaService } from 'app/shared/services/services';
import { DuvidasService } from 'app/shared/services/comum/duvidas.service';
import { of } from 'rxjs';

describe('ListarProcedimentosComReembolsoComponent', () => {
  let component: ListarProcedimentosComReembolsoComponent;
  let fixture: ComponentFixture<ListarProcedimentosComReembolsoComponent>;
  let messageServiceSpy = jasmine.createSpyObj('MessageService',['get']);
  let tipoDeficienciaServiceSpy = jasmine.createSpyObj('TipoDeficienciaService',['get']);
  let comboServiceSpy = jasmine.createSpyObj('ComboService',['get']);
  let documentoTipoProcessoServiceSpy = jasmine.createSpyObj('DocumentoTipoProcessoService',['get']);
  let duvidasServiceSpy = jasmine.createSpyObj('DuvidasService',['get']);
  let procedimentoServiceSpy = jasmine.createSpyObj('ProcedimentoService',['listarProcedimentosComReembolso']);
  procedimentoServiceSpy.listarProcedimentosComReembolso.and.returnValue(of([]));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarProcedimentosComReembolsoComponent ],
      providers:[
        {provide: MessageService, useValue: messageServiceSpy},
        {provide: TipoDeficienciaService, useValue: tipoDeficienciaServiceSpy},
        {provide: ComboService, useValue: comboServiceSpy},
        {provide: DocumentoTipoProcessoService, useValue: documentoTipoProcessoServiceSpy},
        {provide: DuvidasService, useValue: duvidasServiceSpy},
        {provide: ProcedimentoService, useValue: procedimentoServiceSpy},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarProcedimentosComReembolsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
