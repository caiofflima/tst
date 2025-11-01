import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HistoricoProcessoService } from './historico-processo.service';
import { MessageService } from '../../components/messages/message.service';
import { SituacaoPedido } from '../../models/entidades';

describe('HistoricoProcessoService', () => {
  let service: HistoricoProcessoService;
  let httpMock: HttpTestingController;
  const baseUrl = '/siasc-api/api/situacoes-pedido';
  const messageServiceSpy = jasmine.createSpyObj('MessageService',['getDescription']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HistoricoProcessoService, 
        { provide: MessageService, useValue: messageServiceSpy }
      ]
    });

    service = TestBed.inject(HistoricoProcessoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch situacoes-pedido by idPedido', () => {
    const dummySituacoes: SituacaoPedido[] = [
      {} as SituacaoPedido,
      {} as SituacaoPedido
    ];

    service.consultarPorIdPedido(1).subscribe(situacoes => {
      expect(situacoes.length).toBe(2);
      expect(situacoes).toEqual(dummySituacoes);
    });

    const req = httpMock.expectOne(`${baseUrl}/pedido/1?acompanhamento=false`);
    expect(req.request.method).toBe('GET');
    req.flush(dummySituacoes);
  });

  it('should fetch ultima situacao by idPedido', () => {
    const dummySituacao: SituacaoPedido = {} as SituacaoPedido;

    service.consultarUltimaSituacao(1).subscribe(situacao => {
      expect(situacao).toEqual(dummySituacao);
    });

    const req = httpMock.expectOne(`${baseUrl}/pedido/1/ultima-situacao`);
    expect(req.request.method).toBe('GET');
    req.flush(dummySituacao);
  });

  it('should fetch ultima mudanca by idPedido', () => {
    const dummySituacao: SituacaoPedido = {} as SituacaoPedido;

    service.consultarUltimaMudanca(1).subscribe(situacao => {
      expect(situacao).toEqual(dummySituacao);
    });

    const req = httpMock.expectOne(`${baseUrl}/pedido/1/ultima-mudanca?acompanhamento=false`);
    expect(req.request.method).toBe('GET');
    req.flush(dummySituacao);
  });
});
