import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CaraterSolicitacaoService } from './carater-solicitacao.service';
import { MessageService } from '../../components/messages/message.service';
import { CaraterSolicitacao } from '../../models/comum/carater-solicitacao';

describe('CaraterSolicitacaoService', () => {
  let service: CaraterSolicitacaoService;
  let httpMock: HttpTestingController;
  const baseUrl = '/siasc-api/api/caracteres-solicitacao';
  const messageServiceSpy = { getDescription: jest.fn() };

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CaraterSolicitacaoService,
        { provide: MessageService, useValue: messageServiceSpy }
      ]
    });

    service = TestBed.inject(CaraterSolicitacaoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all CaraterSolicitacao', () => {
    const dummyCaraterSolicitacao: CaraterSolicitacao[] = [
      { id: 1, nome: 'Test 1', documentosProcessos: [], pedidos: [] },
      { id: 2, nome: 'Test 2', documentosProcessos: [], pedidos: []  }
    ];

    service.consultarTodos().subscribe(carateres => {
      expect(carateres.length).toBe(2);
      expect(carateres).toEqual(dummyCaraterSolicitacao);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(dummyCaraterSolicitacao);
  });

  it('should handle error when fetching CaraterSolicitacao', () => {
    const errorMessage = 'Http failure response for /siasc-api/api/caracteres-solicitacao: 500 Server Error';

    service.consultarTodos().subscribe(
      () => fail('expected an error, not CaraterSolicitacao'),
      error => expect(error.message).toContain(errorMessage)
    );

    const req = httpMock.expectOne(baseUrl);
    req.flush(errorMessage, { status: 500, statusText: 'Http failure response for /siasc-api/api/caracteres-solicitacao: 500 Server Error' });
  });
});
