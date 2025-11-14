import { of } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocumentoPedidoService, MessageService } from 'app/shared/services/services';
import { AnexoService } from './../../../../services/comum/anexo.service';
import { NormalizeFirstCharacterUpperPipe } from './../../../asc-stepper/pipes/normalize-first-character-upper.pipe';
import { AscCardDadosProcessoComponent } from './asc-card-dados-processo.component';

describe('AscCardDadosProcessoComponent', () => {
  let component: AscCardDadosProcessoComponent;
  let fixture: ComponentFixture<AscCardDadosProcessoComponent>;
  const messageServiceSpy = { getDescription: jest.fn() };
  const anexoServiceSpy = { getDescription: jest.fn() };
  const documentoPedidoServiceSpy = { getDescription: jest.fn() , avisoSituacaoPedido: of(true), avisoSituacaoPedidoComplementares: of(true) };
 
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AscCardDadosProcessoComponent, NormalizeFirstCharacterUpperPipe],
      providers: [
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: AnexoService, useValue: anexoServiceSpy },
        { provide: DocumentoPedidoService, useValue: documentoPedidoServiceSpy },
      ]
    }).compileComponents();
    });

  beforeEach(() => {
    fixture = TestBed.createComponent(AscCardDadosProcessoComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

});