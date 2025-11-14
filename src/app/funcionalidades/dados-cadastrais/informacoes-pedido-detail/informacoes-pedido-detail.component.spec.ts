import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InformacoesPedidoDetailComponent } from './informacoes-pedido-detail.component';
import { ProcessoService, MessageService } from 'app/shared/services/services';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('InformacoesPedidoDetailComponent', () => {
  let component: InformacoesPedidoDetailComponent;
  let fixture: ComponentFixture<InformacoesPedidoDetailComponent>;

  const processoServiceSpy = { consultarPorId: jest.fn() };
  processoServiceSpy.consultarPorId.mockReturnValue(of({}));
  const messageServiceSpy = { addMsgDanger: jest.fn() };
  const routerSpy = { navigate: jest.fn() };
  const locationSpy = { back: jest.fn() };
  const activatedRouteSpy = {
    snapshot: {
      params: { idPedido: 1 }
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InformacoesPedidoDetailComponent],
      providers: [
        { provide: ProcessoService, useValue: processoServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: Location, useValue: locationSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformacoesPedidoDetailComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });
});
