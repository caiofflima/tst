import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MotivoNegacaoService } from './motivo-negacao.service';
import { MessageService } from '../../components/messages/message.service';

describe('MotivoNegacaoService', () => {
  let service: MotivoNegacaoService;
  let httpMock: HttpTestingController;
  const baseUrl = '/siasc-api/api/motivos-negacao';
  const messageServiceSpy = { getDescription: jest.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MotivoNegacaoService, 
        { provide: MessageService, useValue: messageServiceSpy },
      ]
    });

    service = TestBed.inject(MotivoNegacaoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call consultarMotivosNegacaoProcessoPorPedido and return the expected data', () => {
    const dummyData = { data: 'test' };
    const idPedido = 1;

    service.consultarMotivosNegacaoProcessoPorPedido(idPedido).subscribe(data => {
      expect(data).toEqual(dummyData);
    });

    const req = httpMock.expectOne(`${baseUrl}/nivel-processo/pedido/${idPedido}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyData);
  });

  it('should call consultarMotivosNegacaoProcessoPorPedidoAndSituacao and return the expected data', () => {
    const dummyData = { data: 'test' };
    const idPedido = 1;
    const idSituacaoProcesso = 2;

    service.consultarMotivosNegacaoProcessoPorPedidoAndSituacao(idPedido, idSituacaoProcesso).subscribe(data => {
      expect(data).toEqual(dummyData);
    });

    const req = httpMock.expectOne(`${baseUrl}/nivel-processo/pedido/${idPedido}/situacao-processo/${idSituacaoProcesso}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyData);
  });

  it('should call consultarMotivosNegacaoProcedimentoPorPedido and return the expected data', () => {
    const dummyData = { data: 'test' };
    const idPedido = 1;

    service.consultarMotivosNegacaoProcedimentoPorPedido(idPedido).subscribe(data => {
      expect(data).toEqual(dummyData);
    });

    const req = httpMock.expectOne(`${baseUrl}/nivel-procedimento/pedido/${idPedido}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyData);
  });
});
