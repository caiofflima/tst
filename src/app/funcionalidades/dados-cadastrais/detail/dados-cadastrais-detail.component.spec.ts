import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DadosCadastraisDetailComponent } from './dados-cadastrais-detail.component';
import { MessageService, BeneficiarioService, DocumentoTipoProcessoService, InscricaoDependenteService, ProcessoService, SessaoService } from 'app/shared/services/services';
import { Router } from '@angular/router';
import { IntegracaoCorreiosService } from 'app/shared/services/comum/integracao-correios.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Usuario } from 'app/shared/models/entidades';

describe('DadosCadastraisDetailComponent', () => {
  let component: DadosCadastraisDetailComponent;
  let fixture: ComponentFixture<DadosCadastraisDetailComponent>;

  const messageServiceSpy = { addMsgDanger: jest.fn(), addMsgSuccess: jest.fn() };
  const beneficiarioServiceSpy = { consultarPorMatricula: jest.fn() };
  beneficiarioServiceSpy.consultarPorMatricula.mockReturnValue(of({}));
  const documentoTipoProcessoServiceSpy = { consultarPorTipoProcesso: jest.fn() };
  documentoTipoProcessoServiceSpy.consultarPorTipoProcesso.mockReturnValue(of([]));
  const inscricaoDependenteServiceSpy = { save: jest.fn() };
  const processoServiceSpy = { consultarPorId: jest.fn() };
  const sessaoServiceSpy = { getUsuario: jest.fn() };
  const routerSpy = { navigate: jest.fn() };
  const integracaoCorreiosServiceSpy = { consultarEnderecoPorCep: jest.fn() };

  beforeEach(async () => {
    const usuario = {} as Usuario;
    usuario.matriculaFuncional = "C123000";
    usuario.menu = [];
    SessaoService.usuario = usuario;
    await TestBed.configureTestingModule({
      declarations: [DadosCadastraisDetailComponent],
      providers: [
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: BeneficiarioService, useValue: beneficiarioServiceSpy },
        { provide: DocumentoTipoProcessoService, useValue: documentoTipoProcessoServiceSpy },
        { provide: InscricaoDependenteService, useValue: inscricaoDependenteServiceSpy },
        { provide: ProcessoService, useValue: processoServiceSpy },
        { provide: SessaoService, useValue: sessaoServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: IntegracaoCorreiosService, useValue: integracaoCorreiosServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DadosCadastraisDetailComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });
});
