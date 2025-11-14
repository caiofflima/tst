import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ValidacaoDocumentoPedidoService } from './validacao-documento-pedido.service';
import { MessageService } from '../../components/messages/message.service';
import { ValidacaoDocumentoPedido } from '../../models/comum/validacao-documento-pedido';
import { of } from 'rxjs';
import { PrestadorExternoService } from './prestador-externo.service';

describe('ValidacaoDocumentoPedidoService', () => {
  let service: ValidacaoDocumentoPedidoService;
  let httpMock: HttpTestingController;
  const baseUrl = '/siasc-api/api/validacoes-documento-pedido';
  const messageServiceSpy = { getDescription: jest.fn() };
  const prestadorExternoServiceSpy = { get: jest.fn(), consultarUsuarioExternoPorFiltro: jest.fn() };
  prestadorExternoServiceSpy.consultarUsuarioExternoPorFiltro.mockReturnValue(of({}));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ValidacaoDocumentoPedidoService,
        { provide: MessageService, useValue: messageServiceSpy },
        {provide: PrestadorExternoService, useValue: prestadorExternoServiceSpy },

      ]
    });
    service = TestBed.inject(ValidacaoDocumentoPedidoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all validacao documento pedido', () => {
    const dummyResponse = [{ id: 1 }, { id: 2 }];
    
    service.consultarTodos().subscribe((res) => {
      expect(res.length).toBe(2);
      expect(res).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });

  it('should fetch validacao documento pedido by idPedido and idDocProc', () => {
    const dummyResponse: ValidacaoDocumentoPedido = {} as ValidacaoDocumentoPedido;
    const idPedido = 1;
    const idDocProc = 1;

    service.consultarValidacaoDocumentoPedido(idPedido, idDocProc).subscribe((res) => {
      expect(res).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/pedido/${idPedido}/documentos-tipo-processo/${idDocProc}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });

  it('should return an empty observable if idDocProc is not provided', () => {
    service.consultarValidacaoDocumentoPedido(1, null).subscribe((res) => {
      expect(res).toEqual({} as ValidacaoDocumentoPedido);
    });
    
    httpMock.expectNone(`${baseUrl}/pedido/1/documentos-tipo-processo/null`);
  });
});
