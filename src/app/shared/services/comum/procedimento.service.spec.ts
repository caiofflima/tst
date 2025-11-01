import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProcedimentoService } from './procedimento.service';
import { MessageService } from '../services';
import { Procedimento } from '../../models/comum/procedimento';
import { ProcedimentoReembolso } from '../../../../app/shared/models/comum/ProcedimentoReembolso';

describe('ProcedimentoService', () => {
  let service: ProcedimentoService;
  let httpMock: HttpTestingController;
  const baseUrl = '/siasc-api/api/procedimentos';
  const messageServiceSpy = jasmine.createSpyObj('MessageService',['getDescription']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProcedimentoService,
        { provide: MessageService, useValue: messageServiceSpy },
      ]
    });

    service = TestBed.inject(ProcedimentoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch procedimento by id', () => {
    const dummyProcedimento: Procedimento = {} as Procedimento;

    service.consultarPorId(1).subscribe(procedimento => {
      expect(procedimento).toEqual(dummyProcedimento);
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyProcedimento);
  });

  it('should fetch procedimentos by tipo processo', () => {
    const dummyResponse = [{ id: 1, nome: 'Test' }];

    service.consultarProcedimentosPorTipoProcesso(1, 'test', true).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/tipo-processo/1?isIndisponibilidadeRedeCredenciada=true`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });

  it('should fetch procedimentos by tipo processo, sexo and idade', () => {
    const dummyResponse = [{ id: 1, nome: 'Test' }];

    service.consultarProcedimentosPorTipoProcessoAndSexoAndIdade(1, 'M', 30).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/tipo-processo/1/sexo/M/idade/30`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });

  it('should fetch procedimentos by pedido', () => {
    const dummyResponse = [{ id: 1, nome: 'Test' }];

    service.consultarProcedimentosPorPedido(1).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/pedido/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });

  it('should fetch grau procedimento', () => {
    const dummyResponse = { id: 1, nome: 'Test' };

    service.consultarGrauProcedimento(1, 1).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/1/graus/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });

  it('should list procedimentos autorizacao previa', () => {
    const dummyResponse: Procedimento[] = [{} as Procedimento];

    service.listarProcedimentosAutorizacaoPrevia().subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/autorizacaoPrevia`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });

  it('should fetch procedimento by id', () => {
    const dummyResponse = { id: 1, nome: 'Test' };

    service.consultarProcedimentoPorId(1).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/procedimento/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });

  it('should list procedimentos com reembolso', () => {
    const dummyResponse: ProcedimentoReembolso[] = [{} as ProcedimentoReembolso];

    service.listarProcedimentosComReembolso().subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/listaProcedimentosComReembolso`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });
});
