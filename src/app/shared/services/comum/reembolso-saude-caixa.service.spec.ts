import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReembolsoSaudeCaixaService } from './reembolso-saude-caixa.service';
import { MessageService } from '../../components/messages/message.service';
import { RetornoExtratoConsolidadoDTO } from '../../../../app/shared/models/comum/retorno-extrato-consolidado-dto.model';
import { ExtratoLancamentoDTO } from '../../../../app/shared/models/comum/extrato-lancamento-dto.model';
import { LancamentoDTO } from '../../../../app/shared/models/comum/lancamento-dto.model';
import { DadosCartaoDTO } from "../../../../app/shared/models/comum/dados-cartao-dto.model";
import { ReembolsoResumoDTO } from "../../../../app/shared/models/comum/reembolso-resumo-dto.model";
import { ReembolsoDTO } from "../../../../app/shared/models/comum/reembolso-dto.model";
import { ExtratoConsolidadoDTO } from "../../../../app/shared/models/comum/extrato-consolidade-dto.model";
import { CoparticipacaoDTO } from "../../../../app/shared/models/comum/coparticipacao-dto.model";

describe('ReembolsoSaudeCaixaService', () => {
  let service: ReembolsoSaudeCaixaService;
  let httpMock: HttpTestingController;
  const baseUrl = '/siasc-api/api/reembolso';
  const messageServiceSpy = { getDescription: jest.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReembolsoSaudeCaixaService, 
        { provide: MessageService, useValue: messageServiceSpy }
      ]
    });
    service = TestBed.inject(ReembolsoSaudeCaixaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch reembolso consolidado', () => {
    const dummyData: RetornoExtratoConsolidadoDTO = {} as RetornoExtratoConsolidadoDTO;
    service.getReembolsoConsolidado('12345678900', 1, 2023).subscribe(data => {
      expect(data).toEqual(dummyData);
    });

    const req = httpMock.expectOne(`${baseUrl}/getReembolsoConsolidado/12345678900/1/2023`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyData);
  });

  it('should fetch extrato detalhado', () => {
    const dummyData: ExtratoLancamentoDTO[] = [];
    service.getExtratoDetalhado('12345678900', 1, 2023, '12345', 1).subscribe(data => {
      expect(data).toEqual(dummyData);
    });

    const req = httpMock.expectOne(`${baseUrl}/getExtratoDetalhado/12345678900/1/2023/12345/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyData);
  });

  it('should fetch lancamentos do ano por CPF', () => {
    const dummyData: LancamentoDTO[] = [];
    service.getLancamentosDoAnoPorCPF('12345678900', 2023).subscribe(data => {
      expect(data).toEqual(dummyData);
    });

    const req = httpMock.expectOne(`${baseUrl}/getLancamentosDoAnoPorCPF/12345678900/2023`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyData);
  });

  it('should fetch total pagamentos efetuados do ano por CPF', () => {
    const dummyData: LancamentoDTO = {} as LancamentoDTO;
    service.getTotalPagamentosEfetuadosDoAnoPorCPF('12345678900', 2023).subscribe(data => {
      expect(data).toEqual(dummyData);
    });

    const req = httpMock.expectOne(`${baseUrl}/getTotalPagamentosEfetuadosDoAnoPorCPF/12345678900/2023`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyData);
  });

  it('should fetch comprovante IRPF por CPF', () => {
    const dummyData: any = {  };
    service.getComprovanteIRPFPorCPF('12345678900', 2023).subscribe(data => {
      expect(data).toEqual(dummyData);
    });

    const req = httpMock.expectOne(`${baseUrl}/getComprovanteIRPFPorCPF/12345678900/2023`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyData);
  });

  it('should fetch dados cartao por CPF', () => {
    const dummyData: DadosCartaoDTO[] = [];
    service.getDadosCartaoPorCPF('12345678900').subscribe(data => {
      expect(data).toEqual(dummyData);
    });

    const req = httpMock.expectOne(`${baseUrl}/getDadosCartaoPorCPF/12345678900`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyData);
  });

  it('should fetch reembolsos resumo por ano', () => {
    const dummyData: ReembolsoResumoDTO[] = [];
    service.getReembolsosResumoPorAno('12345678900', 2023).subscribe(data => {
      expect(data).toEqual(dummyData);
    });

    const req = httpMock.expectOne(`${baseUrl}/getReembolsosResumoPorAno/12345678900/2023`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyData);
  });

  it('should fetch reembolsos por ano', () => {
    const dummyData: ReembolsoDTO[] = [];
    service.getReembolsosPorAno('12345678900', 2023).subscribe(data => {
      expect(data).toEqual(dummyData);
    });

    const req = httpMock.expectOne(`${baseUrl}/getReembolsosPorAno/12345678900/2023`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyData);
  });

  it('should fetch extratos consolidados', () => {
    const dummyData: ExtratoConsolidadoDTO[] = [];
    service.getExtratosConsolidados('12345678900', 2023).subscribe(data => {
      expect(data).toEqual(dummyData);
    });

    const req = httpMock.expectOne(`${baseUrl}/getExtratosConsolidados/12345678900/2023`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyData);
  });

  it('should fetch coparticipacoes', () => {
    const dummyData: CoparticipacaoDTO[] = [];
    service.getCoparticipacoes('12345678900', 1, 2023, 1, '12345').subscribe(data => {
      expect(data).toEqual(dummyData);
    });

    const req = httpMock.expectOne(`${baseUrl}/getCoparticipacoes/12345678900/1/2023/1/12345`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyData);
  });
});
