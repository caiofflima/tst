import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ExportacaoCSVService } from './exportacao-csv.service';
import { MessageService } from '../../../../components/messages/message.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { PrestadorExternoService } from '../../prestador-externo.service';

describe('ExportacaoCSVService', () => {
  let service: ExportacaoCSVService;
  let httpMock: HttpTestingController;
  const baseUrl = '/siasc-api/api/exporta/csv';
  const messageServiceSpy = { getDescription: jest.fn() };
  const prestadorExternoServiceSpy = { get: jest.fn(), consultarUsuarioExternoPorFiltro: jest.fn() };
  prestadorExternoServiceSpy.consultarUsuarioExternoPorFiltro.mockReturnValue(of({})
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ExportacaoCSVService,
        { provide: MessageService, useValue: messageServiceSpy },
        {provide: PrestadorExternoService, useValue: prestadorExternoServiceSpy },

      ]
    });
    service = TestBed.inject(ExportacaoCSVService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call exportar and return an Observable<any>', () => {
    const dummyResponse = new ArrayBuffer(8);
    const endpoint = '/test-endpoint';
    const body = { key: 'value' };

    service.exportar(endpoint, body).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(baseUrl + endpoint);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);
    expect(req.request.responseType).toBe('arraybuffer');
    req.flush(dummyResponse);
  });
});
