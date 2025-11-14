import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProcessoService } from './processo.service';
import { MessageService } from '../services';
import { ExportacaoService } from '../../../../app/shared/services/comum/exportacao.service';
import { Pedido } from '../../../../app/shared/models/comum/pedido';
import { FiltroConsultaProcesso } from '../../../../app/shared/models/filtro/filtro-consulta-processo';
import { PageRequest } from '../../../../app/shared/components/page-request';
import { Pageable } from '../../components/pageable.model';
import { ProcessoDTO } from '../../models/dto/processo';
import { UsuarioSouCaixaDTO } from 'app/shared/models/comum/usuario-soucaixa-dto.model';
import { ProcessoReembolsoDTO } from 'app/shared/models/dto/processo-reembolso';
import { FiltroProcessoReembolso } from 'app/shared/models/filtro/filtro-processo-reembolso';

describe('ProcessoService', () => {
  let service: ProcessoService;
  let httpMock: HttpTestingController;
  const baseUrl = '/siasc-api/api/pedidos';
  const messageServiceSpy = { getDescription: jest.fn() };
  const exportacaoServiceSpy = { exportarPDF: jest.fn(), exportarXLS: jest.fn(), exportarCSV: jest.fn() };

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProcessoService,
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: ExportacaoService, useValue: exportacaoServiceSpy }
      ]
    });

    service = TestBed.inject(ProcessoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call consultarProcessosAutorizador and return data', () => {
    const mockResponse: Pageable<Pedido> = {} as Pageable<Pedido>;
    const filtro: FiltroConsultaProcesso = {} as FiltroConsultaProcesso;

    service.consultarProcessosAutorizador(filtro).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/consulta/autorizador`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should call consultarPorMatriculaTitular and return data', () => {
    const mockResponse: Pageable<Pedido> = {} as Pageable<Pedido>;
    const matricula = '12345';

    service.consultarPorMatriculaTitular(matricula).subscribe((response: Pageable<Pedido>) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/matricula/${matricula}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should call consultarPaginado and return data', () => {
    const mockResponse: ProcessoDTO[] = [];
    const filtro: FiltroConsultaProcesso = {} as FiltroConsultaProcesso;
    const pageRequest: PageRequest = { pageNumber: 1, pageSize: 10 };

    service.consultarPaginado(filtro, pageRequest).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/consultar-paginado?pageNumber=1&pageSize=10`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should call consultar and return data', () => {
    const mockResponse: Pageable<ProcessoDTO> = {} as Pageable<ProcessoDTO>;
    const filtro: FiltroConsultaProcesso = {} as FiltroConsultaProcesso;

    service.consultar(filtro).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/consultar`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should call consultarComBeneficiario and return data', () => {
    const mockResponse: Pageable<ProcessoDTO> = {} as Pageable<ProcessoDTO>;
    const filtro: FiltroConsultaProcesso = {} as FiltroConsultaProcesso;

    service.consultarComBeneficiario(filtro).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/consultarComBeneficiario`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should call getUsuarioSouCaixa and return data', () => {
    const mockResponse = {} as UsuarioSouCaixaDTO;
    const matricula = '12345';

    service.getUsuarioSouCaixa(matricula).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/usuarioSouCaixa/${matricula}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should call consultarProcessosReembolso and return data', () => {
    const mockResponse: Pageable<ProcessoReembolsoDTO> = {} as Pageable<ProcessoReembolsoDTO>;
    const filtro: FiltroProcessoReembolso = {} as FiltroProcessoReembolso;


    service.consultarProcessosReembolso(filtro).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/pedidos-reembolso`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should call consultarPorId and return data', () => {
    const mockResponse = {} as Pedido;
    const idPedido = 1;

    service.consultarPorId(idPedido).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/${idPedido}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should call consultarProcessosNaoConclusivosPorOperadorCredenciado and return data', () => {
    const mockResponse: ProcessoDTO[] = [];
    const idOperador = 1;
    const idEmpresa = 1;
    const maxResults = 10;

    service.consultarProcessosNaoConclusivosPorOperadorCredenciado(idOperador, idEmpresa, maxResults).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/nao-conclusivos/operador/${idOperador}/credenciado/${idEmpresa}/${maxResults}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should call consultarRecentesPorOperadorCredenciado and return data', () => {
    const mockResponse: ProcessoDTO[] = [];
    const idOperador = 1;
    const idEmpresa = 1;

    service.consultarRecentesPorOperadorCredenciado(idOperador, idEmpresa).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/recentes/operador/${idOperador}/credenciado/${idEmpresa}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

});
