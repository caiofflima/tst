import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PrazoTratamentoService } from './prazo-tratamento.service';
import { MessageService } from '../../components/messages/message.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { PrazoTratamento } from '../../models/comum/prazo-tratamento';

describe('PrazoTratamentoService', () => {
  let service: PrazoTratamentoService;
  let httpMock: HttpTestingController;
  const baseUrl = '/siasc-api/api/prazos-tratamento';
  const messageServiceSpy = { getDescription: jest.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PrazoTratamentoService,
        { provide: MessageService, useValue: messageServiceSpy },
      ]
    });

    service = TestBed.inject(PrazoTratamentoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call consultarProgressoPrazoPorPedido and return an Observable<any>', () => {
    const dummyResponse = { progress: 50 };
    const idPedido = 1;

    service.consultarProgressoPrazoPorPedido(idPedido).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/progresso/${idPedido}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });

  it('should call consultarPorFiltro and return an Observable<PrazoTratamento[]>', () => {
    const dummyResponse: PrazoTratamento[] = [
      {} as PrazoTratamento,
      {} as PrazoTratamento
    ];

    const id = 1;
    const idsTipoProcesso = [1, 2];
    const idsSituacaoProcesso = [1, 2];
    const palavraChave = 'test';
    const diasUteis = true;
    const somenteAtivos = true;
    const mudancaAutomatica = true;
    const tiposBeneficiario = [1, 2];

    service.consultarPorFiltro(id, idsTipoProcesso, idsSituacaoProcesso, palavraChave, diasUteis, somenteAtivos, mudancaAutomatica, tiposBeneficiario).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne((request) => 
      request.url === baseUrl &&
      request.params.has('id') &&
      request.params.has('idsTipoProcesso') &&
      request.params.has('idsSituacaoProcesso') &&
      request.params.has('palavraChave') &&
      request.params.has('diasUteis') &&
      request.params.has('somenteAtivos') &&
      request.params.has('mudancaAutomatica') &&
      request.params.has('tiposBeneficiario')
    );

    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });
});
