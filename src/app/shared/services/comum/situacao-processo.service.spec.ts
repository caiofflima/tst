import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SituacaoProcessoService } from './situacao-processo.service';
import { MessageService } from '../../components/messages/message.service';
import { SituacaoProcesso } from '../../models/comum/situacao-processo';
import { of } from 'rxjs';
import { PrestadorExternoService } from './prestador-externo.service';

describe('SituacaoProcessoService', () => {
  let service: SituacaoProcessoService;
  let httpMock: HttpTestingController;
  const baseUrl = '/siasc-api/api/situacoes-processo';
  const messageServiceSpy = { getDescription: jest.fn() };
  const prestadorExternoServiceSpy = { get: jest.fn(), consultarUsuarioExternoPorFiltro: jest.fn() };
  prestadorExternoServiceSpy.consultarUsuarioExternoPorFiltro.mockReturnValue(of({})


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SituacaoProcessoService, 
        { provide: MessageService, useValue: messageServiceSpy },
        {provide: PrestadorExternoService, useValue: prestadorExternoServiceSpy },

      ]
    });
    service = TestBed.inject(SituacaoProcessoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all SituacaoProcesso', () => {
    const dummySituacoes: SituacaoProcesso[] = [
      {} as SituacaoProcesso,
      {} as SituacaoProcesso
    ];

    service.consultarTodos().subscribe(situacoes => {
      expect(situacoes.length).toBe(2);
      expect(situacoes).toEqual(dummySituacoes);
    });

    const req = httpMock.expectOne(`${baseUrl}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummySituacoes);
  });

  // it('should fetch manual transitions for a given situacaoProcesso and tipoProcesso', () => {
  //   const dummyResponse: SituacaoProcesso[] = [];
  //   const idSituacaoProcesso = 1;
  //   const idTipoProcesso = 2;

  //   service.consultarTransicoesManuais(idSituacaoProcesso, idTipoProcesso).subscribe(response => {
  //     expect(response).toEqual(dummyResponse);
  //   });

  //   const req = httpMock.expectOne(`${baseUrl}/${idSituacaoProcesso}/transicoes/manuais/${idTipoProcesso}/tipo`);
  //   req.flush(dummyResponse);
  //   expect(req.request.method).toBe('GET');
  //   req.flush(dummyResponse);
  // });

  it('should fetch all manual transitions', () => {
    const dummyResponse = { data: 'some data' } as any;

    service.consultarTodasTransicoesManuais().subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/consultarTodasTransicoesManuais`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });

  it('should fetch possible manual transitions for a given pedido', () => {
    const dummyResponse = { data: 'some data' };
    const idPedido = 1;

    service.consultarTransicoesManuaisPossiveisPorPedido(idPedido).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/transicoes/pedido/${idPedido}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });
});
