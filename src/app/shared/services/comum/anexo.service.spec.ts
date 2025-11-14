import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AnexoService } from './anexo.service';
import { MessageService } from '../../components/messages/message.service';
import { of } from 'rxjs';
import * as constantes from '../../../../app/shared/constantes'
describe('AnexoService', () => {
  let service: AnexoService;
  let httpMock: HttpTestingController;
  const baseUrl = '/siasc-api/api/anexos';
  const messageServiceSpy = { getDescription: jest.fn() };
  const mockConstantes = {
    downloadFile: jasmine.createSpy('downloadFile')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AnexoService,
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: constantes, useValue: mockConstantes }
      ]
    });

    service = TestBed.inject(AnexoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch detailed attachments by order ID', () => {
    const dummyResponse = { data: 'test' };
    const idPedido = 1;

    service.consultarAnexosDetalhadosPorIdPedido(idPedido).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/pedido/${idPedido}/anexos-detalhados`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });

  it('should fetch attachments by order ID', () => {
    const dummyResponse = { data: 'test' };
    const idPedido = 1;

    service.consultarPorIdPedido(idPedido).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/pedido/${idPedido}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });

  it('should fetch attachments by order status ID', () => {
    const dummyResponse = { data: 'test' };
    const idSituacaoPedido = 1;

    service.consultarPorIdSituacaoPedido(idSituacaoPedido).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/situacao-pedido/${idSituacaoPedido}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });

  it('should download attachment', () => {
    const anexo = { id: 1, nome: 'test.pdf' };
    const dummyFile = new Blob(['dummy content'], { type: 'application/pdf' });

    jest.jest.spyOn(service, 'obterArquivo').mockReturnValue(of(dummyFile));

    service.realizarDownloadAnexo(anexo);

    expect(service.obterArquivo).toHaveBeenCalledWith(anexo.id);

  });

  it('should fetch file by attachment ID', () => {
    const dummyResponse = new ArrayBuffer(8);
    const idAnexo = 1;

    service.obterArquivo(idAnexo).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/download/${idAnexo}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });

  it('should fetch file by GED ID', () => {
    const dummyResponse = new ArrayBuffer(8);
    const idDocGED = '123';

    service.obterArquivoPorIdGED(idDocGED).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/download/ged/${idDocGED}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });
});
