import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CredenciadoService } from './credenciado.service';
import { MessageService } from '../../components/messages/message.service';
import { ExportacaoService } from './exportacao.service';
import { CredenciadoFilter } from '../../../../app/shared/models/credenciados/credenciado-filter';
import { Credenciado } from '../../../../app/shared/models/credenciados/credenciado';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('CredenciadoService', () => {
  let service: CredenciadoService;
  let httpMock: HttpTestingController;
  const baseUrl = '/siasc-api/api/credenciados';
  const messageServiceSpy = { getDescription: jest.fn() };
  const exportacaoServiceSpy = { exportarPDF: jest.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CredenciadoService,
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: ExportacaoService, useValue: exportacaoServiceSpy }
      ]
    });

    service = TestBed.inject(CredenciadoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch credenciados', () => {
    const filter: CredenciadoFilter = {} as CredenciadoFilter;
    const mockCredenciados: Credenciado[] = [];

    service.buscarCredenciados(filter).subscribe((credenciados) => {
      expect(credenciados).toEqual(mockCredenciados);
    });

    const req = httpMock.expectOne((baseUrl));
    expect(req.request.method).toBe('POST');
    req.flush(mockCredenciados);
  });

  it('should export credenciados to PDF', () => {
    const mockCredenciados: Credenciado[] = [];
    const mockResponse = {};

    exportacaoServiceSpy.exportarPDF.mockReturnValue(of(mockResponse));

    service.exportarPDF(mockCredenciados).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    expect(exportacaoServiceSpy.exportarPDF).toHaveBeenCalledWith('/credenciados', mockCredenciados);
  });
});
