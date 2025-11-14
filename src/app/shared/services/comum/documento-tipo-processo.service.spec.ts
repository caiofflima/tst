import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DocumentoTipoProcessoService } from './documento-tipo-processo.service';
import { MessageService } from '../../components/messages/message.service';
import { DocumentoTipoProcesso } from '../../models/dto/documento-tipo-processo';
import { DocumentoParam } from '../../components/asc-pedido/models/documento.param';
import { FiltroDocumentoProcesso } from '../../models/filtro/filtro-documento-processo';
import { Pageable } from '../../components/pageable.model';

describe('DocumentoTipoProcessoService', () => {
  let service: DocumentoTipoProcessoService;
  let httpMock: HttpTestingController;
  const baseUrl = '/siasc-api/api/documentos/tipo-processo';
  const messageServiceSpy = { getDescription: jest.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DocumentoTipoProcessoService, 
        { provide: MessageService, useValue: messageServiceSpy }
      ]
    });
    service = TestBed.inject(DocumentoTipoProcessoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call consultarPorTipoProcessoAndTipoBeneficiario with correct URL and params', () => {
    const param: DocumentoParam = {
      idTipoProcesso: 1,
      idTipoBeneficiario: 2,
      idMotivo: 3,
      idEstadoCivil: 4,
      sexo: 'M',
      idade: 30,
      valorRenda: 1000,
      idTipoDeficiencia: 5
    };

    service.consultarPorTipoProcessoAndTipoBeneficiario(param).subscribe();

    const req = httpMock.expectOne((request) => 
      request.url === `${baseUrl}/1/tipo-beneficiario/2` &&
      request.params.get('idMotivoSolicitacao') === '3' &&
      request.params.get('idEstadoCivil') === '4' &&
      request.params.get('sexo') === 'M' &&
      request.params.get('idade') === '30' &&
      request.params.get('valorRenda') === '1000' &&
      request.params.get('idTipoDeficiencia') === '5'
    );

    expect(req.request.method).toBe('GET');
  });

  it('should call consultarPorFiltro with correct URL and params', () => {
    const filtro: FiltroDocumentoProcesso = {} as FiltroDocumentoProcesso;
    const limit = 10;
    const offset = 1;

    service.consultarPorFiltro(filtro, limit, offset).subscribe();

    const req = httpMock.expectOne((request) => 
      request.url === `${baseUrl}/consultar` &&
      request.params.get('limit') === '10' &&
      request.params.get('offset') === '1'
    );
    expect(req.request.method).toBe('POST');
  });

  it('should call consultarPorProcesso with correct URL', () => {
    const idTipoProcesso = 1;
    const matricula = '12345';

    service.consultarPorProcesso(idTipoProcesso, matricula).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/consultarPorProcesso/tipo-processo/1/matricula/12345`);
    expect(req.request.method).toBe('GET');
  });

  it('should call consultarRequeridosPorIdPedido with correct URL', () => {
    const idPedido = 1;

    service.consultarRequeridosPorIdPedido(idPedido).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/requeridos/pedido/1`);
    expect(req.request.method).toBe('GET');
  });

  it('should call consultarComplementaresPorIdPedido with correct URL', () => {
    const idPedido = 1;

    service.consultarComplementaresPorIdPedido(idPedido).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/complementares/pedido/1`);
    expect(req.request.method).toBe('GET');
  });

  it('should call incluir with correct URL and payload', () => {
    const documentoTipoProcesso: DocumentoTipoProcesso = {};

    service.incluir(documentoTipoProcesso).subscribe();

    const req = httpMock.expectOne(`${baseUrl}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(documentoTipoProcesso);
  });

  it('should call alterar with correct URL and payload', () => {
    const documentoTipoProcesso: DocumentoTipoProcesso = {};

    service.alterar(documentoTipoProcesso).subscribe();

    const req = httpMock.expectOne(`${baseUrl}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(documentoTipoProcesso);
  });

  it('should call excluir with correct URL', () => {
    const id = 1;

    service.excluir(id).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');
  });
});
