import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReembolsoAGSService } from './reembolso-ags.service';
import { MessageService } from '../../components/messages/message.service';
import { LancamentoDTO } from '../../../../app/shared/models/comum/lancamento-dto.model';
import { ReembolsoAGS } from '../../../../app/shared/models/comum/reembolso-ags';

describe('ReembolsoAGSService', () => {
  let service: ReembolsoAGSService;
  let httpMock: HttpTestingController;
  const baseUrl = '/siasc-api/api/reembolso-ags';
  const messageServiceSpy = { getDescription: jest.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReembolsoAGSService, 
        { provide: MessageService, useValue: messageServiceSpy }
      ]
    });

    service = TestBed.inject(ReembolsoAGSService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch lancamentos do ano por CPF', () => {
    const dummyLancamentos: LancamentoDTO[] = [
      {} as LancamentoDTO,
      {} as LancamentoDTO
    ];

    service.getLancamentosDoAnoPorCPF('12345678900', 2023).subscribe(lancamentos => {
      expect(lancamentos.length).toBe(2);
      expect(lancamentos).toEqual(dummyLancamentos);
    });

    const req = httpMock.expectOne(`${baseUrl}/getLancamentosDoAnoPorCPF/12345678900/2023`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyLancamentos);
  });

  it('should fetch reembolso por CPF, mes e ano', () => {
    const dummyReembolsos: ReembolsoAGS[] = [
      {} as ReembolsoAGS,
      {} as ReembolsoAGS
    ];

    service.getReembolsoPorCPFMesAno('12345678900', 5, 2023).subscribe(reembolsos => {
      expect(reembolsos.length).toBe(2);
      expect(reembolsos).toEqual(dummyReembolsos);
    });

    const req = httpMock.expectOne(`${baseUrl}/getReembolsoPorCPFMesAno/12345678900/5/2023`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyReembolsos);
  });

  it('should fetch total reembolsos do ano por CPF', () => {
    const dummyReembolso: ReembolsoAGS = {} as ReembolsoAGS;

    service.getTotalReembolsosDoAnoPorCPF('12345678900', 2023).subscribe(reembolso => {
      expect(reembolso).toEqual(dummyReembolso);
    });

    const req = httpMock.expectOne(`${baseUrl}/getTotalReembolsosDoAnoPorCPF/12345678900/2023`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyReembolso);
  });

  it('should fetch reembolsos mensais do ano por CPF', () => {
    const dummyReembolsos: ReembolsoAGS[] = [
      {} as ReembolsoAGS,
      {} as ReembolsoAGS
    ];

    service.getReembolsosMensaisDoAnoPorCPF('12345678900', 2023).subscribe(reembolsos => {
      expect(reembolsos.length).toBe(2);
      expect(reembolsos).toEqual(dummyReembolsos);
    });

    const req = httpMock.expectOne(`${baseUrl}/getReembolsosMensaisDoAnoPorCPF/12345678900/2023`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyReembolsos);
  });
});
