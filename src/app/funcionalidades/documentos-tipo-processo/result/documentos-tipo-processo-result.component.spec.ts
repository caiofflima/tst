import { Location } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PrestadorExternoService } from 'app/shared/services/services';
import { of, throwError } from 'rxjs';
import { MessageService } from '../../../shared/components/messages/message.service';
import { DocumentoTipoProcesso } from '../../../shared/models/dto/documento-tipo-processo';
import { DocumentoTipoProcessoService } from '../../../shared/services/comum/documento-tipo-processo.service';
import { DocumentosTipoProcessoResultComponent } from './documentos-tipo-processo-result.component';

describe('DocumentosTipoProcessoResultComponent', () => {
  let component: DocumentosTipoProcessoResultComponent;
  let fixture: ComponentFixture<DocumentosTipoProcessoResultComponent>;
  let mockRouter: any;
  let mockLocation: any;
  let mockMessageService: any;
  let mockActivatedRoute: any;
  let mockDocumentoTipoProcessoService: any;
  const prestadorExternoServiceSpy = { get: jest.fn(), consultarUsuarioExternoPorFiltro: jest.fn() };
  prestadorExternoServiceSpy.consultarUsuarioExternoPorFiltro = of({})

  beforeEach(async () => {
    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    mockLocation = {
      back: jasmine.createSpy('back')
    };

    mockMessageService = {
      addMsgDanger: jasmine.createSpy('addMsgDanger'),
      showDangerMsg: jasmine.createSpy('showDangerMsg'),
      fromResourceBundle: jasmine.createSpy('fromResourceBundle')
    };

    mockActivatedRoute = {
      snapshot: {
        queryParams: {
          v: 1,
          sexo: 'M',
          idade: '30',
          idMotivoSolicitacao: '1',
          idTipoDeficiencia: '1',
          valorRenda: '1000',
          estadoCivil: '1,2',
          tiposProcesso: '1,2',
          tiposBeneficiario: '1,2'
        }
      }
    };

    mockDocumentoTipoProcessoService = {
      consultarPorFiltro: jasmine.createSpy('consultarPorFiltro').mockReturnValue(of({
        total: 1,
        dados: [new DocumentoTipoProcesso()]
      })),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [DocumentosTipoProcessoResultComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: Location, useValue: mockLocation },
        { provide: MessageService, useValue: mockMessageService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
  {provide: PrestadorExternoService, useValue: prestadorExternoServiceSpy },

        { provide: DocumentoTipoProcessoService, useValue: mockDocumentoTipoProcessoService }
      ],
      schemas: [
          CUSTOM_ELEMENTS_SCHEMA
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentosTipoProcessoResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Inicializa o componente
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy(); // Verifica se o componente foi criado
  });

  it('deve carregar os documentos ao chamar pesquisar', () => {
    component.pesquisar(); // Chama o método pesquisar
    expect(mockDocumentoTipoProcessoService.consultarPorFiltro).toHaveBeenCalled(); // Verifica se o serviço foi chamado
    expect(component.listaDocumentoProcesso.length).toBe(1); // Verifica se a lista de documentos foi preenchida
  });

  it('deve lidar com erros ao carregar documentos', () => {
    const errorResponse = { error: 'Error message' };
    mockDocumentoTipoProcessoService.consultarPorFiltro.mockReturnValue(throwError(errorResponse));
    component.pesquisar(); // Chama o método pesquisar
    expect(component.loading).toBe(false);
    expect(mockMessageService.addMsgDanger).toHaveBeenCalled() // Verifica se a mensagem de erro foi chamada
  });

  it('deve navegar para a página anterior ao chamar voltar', () => {
    component.voltar(); // Chama o método voltar
    expect(mockLocation.back).toHaveBeenCalled(); // Verifica se a função back foi chamada
  });

});