import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AutorizacaoPreviaService } from './autorizacao-previa.service';
import { MessageService } from '../../../components/messages/message.service';
import { FileUploadService } from '../file-upload.service';
import { Pedido } from '../../../../../app/shared/models/comum/pedido';
import { PrestadorExternoService } from '../prestador-externo.service';
import { of } from 'rxjs';

describe('AutorizacaoPreviaService', () => {
  let service: AutorizacaoPreviaService;
  let httpMock: HttpTestingController;
  const baseUrl = '/siasc-api/api/pedido/autorizacao-previa';
  const messageServiceSpy = jasmine.createSpyObj('MessageService',['getDescription']);
  const fileUploadServiceSpy = jasmine.createSpyObj('FileUploadService',['realizarUpload']);
  const prestadorExternoServiceSpy = jasmine.createSpyObj('PrestadorExternoService',['get','consultarUsuarioExternoPorFiltro']);
  prestadorExternoServiceSpy.consultarUsuarioExternoPorFiltro = of({})

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AutorizacaoPreviaService,
        { provide: MessageService, useValue: messageServiceSpy },
        {provide: PrestadorExternoService, useValue: prestadorExternoServiceSpy },

        { provide: FileUploadService, useValue: fileUploadServiceSpy },
      ]
    });

    service = TestBed.inject(AutorizacaoPreviaService);
    httpMock = TestBed.inject(HttpTestingController);

  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should include a new authorization', () => {
    const mockResponse: Pedido = {} as Pedido;
    const autorizacaoPrevia = {};

    service.incluirNovo(autorizacaoPrevia).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should update process status', () => {
    const mockResponse = {} as any;
    const idPedido = 1;
    const idSituacaoProcesso = 2;

    service.atualizarSituacaoProcesso(idPedido, idSituacaoProcesso).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/pedido/${idPedido}/situacao-processo/${idSituacaoProcesso}`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);
  });

  it('should release process for analysis', () => {
    const mockResponse = {} as any;
    const idPedido = 1;

    service.liberarProcessoParaAnalise(idPedido).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/pedido/${idPedido}/liberado-para-analise/`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);
  });

  it('should include draft order', () => {
    const mockResponse = {};
    const value = {
      beneficiario: { id: 1 },
      tipoProcesso: { id: 2 },
      idMotivoSolicitacao: 3,
      idCredenciado: 4
    };

    service.incluirPedidoModoRascunho(value).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/rascunho/1/2/3/4`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);
  });

  it('should update order', () => {
    const mockResponse = {};
    const pedido = { /* mock data */ };

    service.atualizar(pedido).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);
  });

  it('should cancel order', () => {
    const mockResponse = {};
    const idPedido = 1;

    service.cancelarPedido(idPedido).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/cancelar/${idPedido}`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);
  });

  it('should get order by id', () => {
    const mockResponse: Pedido = {} as Pedido;
    const idPedido = 1;

    service.consultarPorId(idPedido).subscribe((response: Pedido) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/${idPedido}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get by beneficiary and procedure id', () => {
    const mockResponse = {};
    const idBeneficiario = 1;
    const idProcedimento = 2;

    service.consultarPorIdBeneficiarioAndIdProcedimento(idBeneficiario, idProcedimento).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/consultar-por-beneficiario-and-procedimento?idBeneficiario=${idBeneficiario}&idProcedimento=${idProcedimento}&naoWeb=false`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should verify authorizations with valid attendance date', () => {
    const mockResponse = {};
    const idAutorizacao = 1;
    const dataAtendimento = '2023-01-01';

    service.verificarAutorizacoesComDataAtentimentoValida(idAutorizacao, dataAtendimento).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/idAutorizacao/${idAutorizacao}/dataAtendimento/${dataAtendimento}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  
});
