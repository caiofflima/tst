import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MessageService } from '../../components/messages/message.service';
import { MensagemPedidoDTO } from '../../../../app/shared/models/dtos';
import { MensagemPedidoService } from './mensagem-enviada.service';

describe('MensagemPedidoService', () => {
  let service: MensagemPedidoService;
  let httpMock: HttpTestingController;
  const baseUrl = '/siasc-api/api/mensagens-pedido';
  const messageServiceSpy = { getDescription: jest.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MensagemPedidoService,
        { provide: MessageService, useValue: messageServiceSpy },
      ]
    });
    service = TestBed.inject(MensagemPedidoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call consultarPorIdPedido and return the correct data', () => {
    const dummyData = { id: 1, message: 'Test message' };
    const idPedido = 1;

    service.consultarPorIdPedido(idPedido).subscribe(data => {
      expect(data).toEqual(dummyData);
    });

    const req = httpMock.expectOne(`${baseUrl}/pedido/${idPedido}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyData);
  });

  it('should call consultarPorIdSituacaoPedido and return the correct data', () => {
    const dummyData = { id: 1, message: 'Test message' };
    const idSituacaoPedido = 1;

    service.consultarPorIdSituacaoPedido(idSituacaoPedido).subscribe(data => {
      expect(data).toEqual(dummyData);
    });

    const req = httpMock.expectOne(`${baseUrl}/situacao-pedido/${idSituacaoPedido}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyData);
  });

  it('should call atualizarMensagemPedidoLida and return the correct data', () => {
    const dummyData = { success: true };
    const id = 1;

    service.atualizarMensagemPedidoLida(id).subscribe(data => {
      expect(data).toEqual(dummyData);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toBe(id);
    req.flush(dummyData);
  });

  it('should call reenviarMensagemPedido and return the correct data', () => {
    const dummyData = { success: true };
    const mensagemPedido: MensagemPedidoDTO = {} as MensagemPedidoDTO;

    service.reenviarMensagemPedido(mensagemPedido).subscribe(data => {
      expect(data).toEqual(dummyData);
    });

    const req = httpMock.expectOne(`${baseUrl}/reenviar/`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBe(mensagemPedido);
    req.flush(dummyData);
  });
});
