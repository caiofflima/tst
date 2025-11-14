import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ExportacaoPDFService } from './exportacao-pdf.service';
import { MessageService } from '../../../../components/messages/message.service';
import { HttpClient } from '@angular/common/http';
import { PrestadorExternoService } from '../../prestador-externo.service';
import { of } from 'rxjs';

describe('ExportacaoPDFService', () => {
  let service: ExportacaoPDFService;
  let httpMock: HttpTestingController;
  const baseUrl = '/siasc-api/api/exporta/pdf';
  const messageServiceSpy = { getDescription: jest.fn() };
  const prestadorExternoServiceSpy = { get: jest.fn(), consultarUsuarioExternoPorFiltro: jest.fn() };
  prestadorExternoServiceSpy.consultarUsuarioExternoPorFiltro.mockReturnValue(of({})


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ExportacaoPDFService, 
        { provide: MessageService, useValue: messageServiceSpy },
        {provide: PrestadorExternoService, useValue: prestadorExternoServiceSpy },

      ]
    }));

    service = TestBed.inject(ExportacaoPDFService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call exportar with correct URL and body', () => {
    const endpoint = '/test-endpoint';
    const body = { key: 'value' };
    const mockResponse = new ArrayBuffer(8);

    service.exportar(endpoint, body).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(baseUrl + endpoint);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);
    expect(req.request.responseType).toBe('arraybuffer');
    req.flush(mockResponse);
  });
});
