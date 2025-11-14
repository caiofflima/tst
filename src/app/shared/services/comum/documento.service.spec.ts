import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DocumentoService } from './documento.service';
import { MessageService } from '../../components/messages/message.service';
import { Documento } from '../../models/comum/documento';
import { FiltroConsultaDocumento } from '../../models/filtro/filtro-consulta-documento';

describe('DocumentoService', () => {
  let service: DocumentoService;
  let httpMock: HttpTestingController;
  const baseUrl = '/siasc-api/api/documentos';
  const messageServiceSpy = { getDescription: jest.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DocumentoService, 
        { provide: MessageService, useValue: messageServiceSpy }
      ]
    });

    service = TestBed.inject(DocumentoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch documentos disponiveis por id pedido', () => {
    const dummyDocumentos: Documento[] = [
      { id: 1, nome: 'Documento 1' },
      { id: 2, nome: 'Documento 2' }
    ];

    service.consultarDocumentosDisponiveisPorIdPedido(1).subscribe(documentos => {
      expect(documentos.length).toBe(2);
      expect(documentos).toEqual(dummyDocumentos);
    });

    const req = httpMock.expectOne(`${baseUrl}/pedido/1/adicionais`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyDocumentos);
  });

  it('should fetch documentos by filtro', () => {
    const dummyDocumentos: Documento[] = [
      { id: 1, nome: 'Documento 1' },
      { id: 2, nome: 'Documento 2' }
    ];

    const filtro: FiltroConsultaDocumento = {
      id: 1,
      idTipoDocumento: 2,
      nome: 'Documento 1',
      opme: 'opme1',
      ativo: 'true',
      link: 'link1'
    };

    service.consultarPorFiltro(filtro).subscribe(documentos => {
      expect(documentos.length).toBe(2);
      expect(documentos).toEqual(dummyDocumentos);
    });

    const req = httpMock.expectOne(req => 
      req.url === baseUrl &&
      req.params.get('id') === '1' &&
      req.params.get('idTipoDocumento') === '2' &&
      req.params.get('nome') === 'Documento 1' &&
      req.params.get('opme') === 'opme1' &&
      req.params.get('ativo') === 'true' &&
      req.params.get('link') === 'link1'
    );

    expect(req.request.method).toBe('GET');
    req.flush(dummyDocumentos);
  });
});
