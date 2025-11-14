import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DocumentoPedidoService } from './documento-pedido.service';
import { MessageService } from '../../components/messages/message.service';
import { DocumentoPedidoDTO } from '../../models/dto/documento-pedido';
import { AnexoDTO } from '../../models/dto/anexo';
import { DocumentoPedido } from '../../models/comum/documento-pedido';
import { SituacaoPedido } from '../../../../app/shared/models/entidades';

describe('DocumentoPedidoService', () => {
  let service: DocumentoPedidoService;
  let httpMock: HttpTestingController;
  const baseUrl = '/siasc-api/api/documentos-pedido';
  const messageServiceSpy = { getDescription: jest.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DocumentoPedidoService, 
        { provide: MessageService, useValue: messageServiceSpy }
      ]
    });

    service = TestBed.inject(DocumentoPedidoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call excluirPorIdPedidoAndIdDocumentoTipoProcesso and return void', () => {
    const idPedido = 1;
    const idDocumentoTipoProcesso = 1;

    service.excluirPorIdPedidoAndIdDocumentoTipoProcesso(idPedido, idDocumentoTipoProcesso).subscribe(response => {
      expect(response).toBe(null);
    });

    const req = httpMock.expectOne(`${baseUrl}/pedido/${idPedido}/documento-tipo-processo/${idDocumentoTipoProcesso}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should call incluirDocumentoAdicional and return DocumentoPedido', () => {
    const idPedido = 1;
    const idDocumento = 1;
    const mockDocumentoPedido: DocumentoPedido = {} as DocumentoPedido;

    service.incluirDocumentoAdicional(idPedido, idDocumento).subscribe(response => {
      expect(response).toEqual(mockDocumentoPedido);
    });

    const req = httpMock.expectOne(`${baseUrl}/pedido/${idPedido}/documento-adicional/${idDocumento}`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockDocumentoPedido);
  });

  it('should call consultarDocumentosObrigatoriosPorPedido and return DocumentoPedidoDTO[]', () => {
    const idPedido = 1;
    const mockDocumentos: DocumentoPedidoDTO[] = [];

    service.consultarDocumentosObrigatoriosPorPedido(idPedido).subscribe(response => {
      expect(response).toEqual(mockDocumentos);
    });

    const req = httpMock.expectOne(`${baseUrl}/pedido/${idPedido}/obrigatorios`);
    expect(req.request.method).toBe('GET');
    req.flush(mockDocumentos);
  });

  it('should call consultarDocumentosPorPedidoAndSituacao and return AnexoDTO[]', () => {
    const idPedido = 1;
    const idSituacaoPedido = 1;
    const mockAnexos: AnexoDTO[] = [];

    service.consultarDocumentosPorPedidoAndSituacao(idPedido, idSituacaoPedido).subscribe(response => {
      expect(response).toEqual(mockAnexos);
    });

    const req = httpMock.expectOne(`${baseUrl}/pedido/${idPedido}/situacao/${idSituacaoPedido}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAnexos);
  });

  it('should call consultarDocumentosComplementaresPorPedido and return DocumentoPedidoDTO[]', () => {
    const idPedido = 1;
    const mockDocumentos: DocumentoPedidoDTO[] = [];

    service.consultarDocumentosComplementaresPorPedido(idPedido).subscribe(response => {
      expect(response).toEqual(mockDocumentos);
    });

    const req = httpMock.expectOne(`${baseUrl}/pedido/${idPedido}/complementares`);
    expect(req.request.method).toBe('GET');
    req.flush(mockDocumentos);
  });

  it('should set and get documentos', () => {
    const mockDocumentos: DocumentoPedidoDTO[] = [];
    service.setDocumentos(mockDocumentos);
    expect(service.getDocumentos()).toEqual(mockDocumentos);
  });

  it('should set and get situacaoPedido', () => {
    const mockSituacaoPedido: SituacaoPedido = {} as SituacaoPedido;
    service.setAguardandoDocumentacao(mockSituacaoPedido);
    expect(service.getSituacaoPedido()).toEqual(mockSituacaoPedido);
  });

  it('should emit avisoParaBotao on setAvisoDeMudanca', () => {
    jest.jest.jest.jest.spyOn(service.avisoParaBotao, 'emit');
    service.setAvisoDeMudanca('doc');
    expect(service.avisoParaBotao.emit).toHaveBeenCalledWith('doc');
  });

  // it('should emit avisoSituacaoPedido on setAvisoSituacaoPedido', () => {
  //   jest.jest.jest.jest.spyOn(service.avisoSituacaoPedido, 'emit');
  //   service.setAvisoSituacaoPedido(true);
  //   expect(service.avisoSituacaoPedido.emit).toHaveBeenCalledWith(true);
  // });
});
