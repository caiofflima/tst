import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SituacaoPedidoProcedimentoService } from './situacao-pedido-procedimento.service';
import { MessageService } from '../../components/messages/message.service';
import { SituacaoPedidoProcedimento } from '../../models/dto/situacao-pedido-procedimento';

describe('SituacaoPedidoProcedimentoService', () => {
  let service: SituacaoPedidoProcedimentoService;
  let httpMock: HttpTestingController;
  const baseUrl = '/siasc-api/api/situacoes-pedido-procedimento';
  const messageServiceSpy = jasmine.createSpyObj('MessageService',['getDescription']);

  beforeEach(() => {
       TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SituacaoPedidoProcedimentoService,
        { provide: MessageService, useValue: messageServiceSpy }
      ]
    });

    service = TestBed.inject(SituacaoPedidoProcedimentoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch the last situacao pedido procedimento by id', () => {
    const dummySituacao: SituacaoPedidoProcedimento = {} as SituacaoPedidoProcedimento;

    service.consultarUltimaSituacaoPedidoProcedimento(1).subscribe(situacao => {
      expect(situacao).toEqual(dummySituacao);
    });

    const req = httpMock.expectOne(`${baseUrl}/pedido-procedimento/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummySituacao);
  });

  it('should fetch pedidos procedimentos analisados by id pedido', () => {
    const dummySituacoes: SituacaoPedidoProcedimento[] = [
      {} as SituacaoPedidoProcedimento,
      {} as SituacaoPedidoProcedimento
    ];

    service.consultarPedidosProcedimentosAnalisadosPorIdPedido(1).subscribe(situacoes => {
      expect(situacoes.length).toBe(2);
      expect(situacoes).toEqual(dummySituacoes);
    });

    const req = httpMock.expectOne(`/siasc-api/api/processos/1/pedidos-procedimentos-analisados`);
    expect(req.request.method).toBe('GET');
    req.flush(dummySituacoes);
  });
});
