import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SituacaoPedidoService } from './situacao-pedido.service';
import { MessageService } from '../../components/messages/message.service';
import { SituacaoPedido } from '../../models/comum/situacao-pedido';
import { of } from 'rxjs';
import { PrestadorExternoService } from './prestador-externo.service';

describe('SituacaoPedidoService', () => {
  let service: SituacaoPedidoService;
  let httpMock: HttpTestingController;
  const baseUrl = '/siasc-api/api/situacoes-pedido';
  const messageServiceSpy = { getDescription: jest.fn() };
  const dummySituacaoPedido: SituacaoPedido = {} as SituacaoPedido;

  const prestadorExternoServiceSpy = { get: jest.fn(), consultarUsuarioExternoPorFiltro: jest.fn() };
  prestadorExternoServiceSpy.consultarUsuarioExternoPorFiltro.mockReturnValue(of({})

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SituacaoPedidoService,
        { provide: MessageService, useValue: messageServiceSpy },
        {provide: PrestadorExternoService, useValue: prestadorExternoServiceSpy },

      ]
    }));

    service = TestBed.inject(SituacaoPedidoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call consultarUltimaMudancaStatusPedido and return an Observable<SituacaoPedido>', () => {
    const idPedido = 1;

    service.consultarUltimaMudancaStatusPedido(idPedido).subscribe(situacaoPedido => {
      expect(situacaoPedido).toEqual(dummySituacaoPedido);
    });

    const req = httpMock.expectOne(`${baseUrl}/pedido/${idPedido}/ultima-mudanca-status`);
    expect(req.request.method).toBe('GET');
    req.flush(dummySituacaoPedido);
  });

  it('should call consultarSituacoesPedidoPorPedido and return an Observable<SituacaoPedido[]>', () => {
    const dummySituacoesPedido: SituacaoPedido[] = [];
    const idPedido = 1;

    service.consultarSituacoesPedidoPorPedido(idPedido).subscribe(situacoesPedido => {
      expect(situacoesPedido).toEqual(dummySituacoesPedido);
    });

    const req = httpMock.expectOne(`${baseUrl}/pedido/${idPedido}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummySituacoesPedido);
  });

  it('should call incluirMudancaSituacaoPedido and return an Observable<any>', () => {
    const dummyResponse = {};
    const situacaoPedido: SituacaoPedido =  {} as SituacaoPedido;

    service.incluirMudancaSituacaoPedido(situacaoPedido).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/incluir/mudanca-situacao/`);
    expect(req.request.method).toBe('POST');
    req.flush(dummyResponse);
  });

  it('should call incluirOcorrenciaPedido and return an Observable<SituacaoPedido>', () => {
    const situacaoPedido: SituacaoPedido =  {} as SituacaoPedido;

    service.incluirOcorrenciaPedido(situacaoPedido).subscribe(response => {
      expect(response).toEqual(dummySituacaoPedido);
    });

    const req = httpMock.expectOne(`${baseUrl}/incluir/ocorrencia/`);
    expect(req.request.method).toBe('POST');
    req.flush(dummySituacaoPedido);
  });

  it('should call liberacaoAlcada and return an Observable<any>', () => {
    const dummyResponse = { /* mock response */ };
    const idPedidos = [1, 2, 3];

    service.liberacaoAlcada(idPedidos).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/liberacao-alcada/${idPedidos.join(',')}`);
    expect(req.request.method).toBe('POST');
    req.flush(dummyResponse);
  });
});
