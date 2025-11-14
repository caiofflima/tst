import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TipoDocumentoService } from './tipo-documento.service';
import { MessageService } from '../../components/messages/message.service';
import { TipoDocumento } from '../../models/comum/tipo-documento';
import { of } from 'rxjs';
import { PrestadorExternoService } from './prestador-externo.service';

describe('TipoDocumentoService', () => {
  let service: TipoDocumentoService;
  let httpMock: HttpTestingController;
  const baseUrl = '/siasc-api/api/tipo-documento';
  const messageServiceSpy = { getDescription: jest.fn() };
  const prestadorExternoServiceSpy = { get: jest.fn(), consultarUsuarioExternoPorFiltro: jest.fn() };
  prestadorExternoServiceSpy.consultarUsuarioExternoPorFiltro.mockReturnValue(of({}));

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TipoDocumentoService,
        { provide: MessageService, useValue: messageServiceSpy },
  {provide: PrestadorExternoService, useValue: prestadorExternoServiceSpy },

      ]
    });
    service = TestBed.inject(TipoDocumentoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all TipoDocumento', () => {
    const dummyTipoDocumentos: TipoDocumento[] = [
      {} as TipoDocumento,
      {} as TipoDocumento
    ];

    service.consultarTodos().subscribe(tipoDocumentos => {
      expect(tipoDocumentos.length).toBe(2);
      expect(tipoDocumentos).toEqual(dummyTipoDocumentos);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(dummyTipoDocumentos);
  });

  it('should add a new TipoDocumento', () => {
    const newTipoDocumento: TipoDocumento = {} as TipoDocumento;

    service.incluir(newTipoDocumento).subscribe(tipoDocumento => {
      expect(tipoDocumento).toEqual(newTipoDocumento);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    req.flush(newTipoDocumento);
  });

  it('should update an existing TipoDocumento', () => {
    const updatedTipoDocumento: TipoDocumento = {} as TipoDocumento;

    service.alterar(updatedTipoDocumento).subscribe(tipoDocumento => {
      expect(tipoDocumento).toEqual(updatedTipoDocumento);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedTipoDocumento);
  });

  it('should delete a TipoDocumento', () => {
    const id = 1;

    service.excluir(id).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${baseUrl}/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
