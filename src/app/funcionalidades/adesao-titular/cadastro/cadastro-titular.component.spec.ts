import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CadastroTitularComponent } from './cadastro-titular.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AtendimentoService } from 'app/shared/services/comum/atendimento.service';
import { DocumentoTipoProcessoService, MessageService, SessaoService } from 'app/shared/services/services';

describe('CadastroTitularComponent', () => {
  let component: CadastroTitularComponent;
  let fixture: ComponentFixture<CadastroTitularComponent>;

  // Mock services
  const messageServiceSpy = { /* add methods as needed */ };
  const documentoTipoProcessoServiceSpy = { /* add methods as needed */ };
  const sessaoServiceSpy = { /* add methods as needed */ };
  const atendimentoServiceSpy = { /* add methods as needed */ };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CadastroTitularComponent],
      providers: [
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: DocumentoTipoProcessoService, useValue: documentoTipoProcessoServiceSpy },
        { provide: SessaoService, useValue: sessaoServiceSpy },
        { provide: AtendimentoService, useValue: atendimentoServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastroTitularComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });
});
