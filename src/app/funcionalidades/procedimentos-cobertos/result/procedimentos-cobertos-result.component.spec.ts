import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ProcedimentosCobertosResultComponent } from './procedimentos-cobertos-result.component';
import { ProcedimentoService } from 'app/shared/services/services';
import { DocumentoTipoProcessoService } from 'app/shared/services/comum/documento-tipo-processo.service';
import { MessageService } from 'app/shared/components/messages/message.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ProcedimentosCobertosResultComponent', () => {
  let component: ProcedimentosCobertosResultComponent;
  let fixture: ComponentFixture<ProcedimentosCobertosResultComponent>;

  const procedimentoServiceSpy = { consultarProcedimentosPorTipoProcesso: jest.fn() };
  procedimentoServiceSpy.consultarProcedimentosPorTipoProcesso.mockReturnValue(of([]));
  const documentoTipoProcessoServiceSpy = { getTitulo: jest.fn(), getBaseURL: jest.fn() };
  const messageServiceSpy = { addMsgDanger: jest.fn() };
  const activatedRouteSpy = {
    snapshot: {
      queryParams: {
        idTipoProcesso: null
      }
    }
  };
  const routerSpy = { navigate: jest.fn() };
  const locationSpy = { back: jest.fn() };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProcedimentosCobertosResultComponent],
      providers: [
        { provide: ProcedimentoService, useValue: procedimentoServiceSpy },
        { provide: DocumentoTipoProcessoService, useValue: documentoTipoProcessoServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: Router, useValue: routerSpy },
        { provide: Location, useValue: locationSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcedimentosCobertosResultComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });
});
