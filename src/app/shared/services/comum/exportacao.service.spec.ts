import { TestBed } from '@angular/core/testing';
import { ExportacaoService } from './exportacao.service';

import { of } from 'rxjs';
import { ExportacaoCSVService } from './exportacao/csv/exportacao-csv.service';
import { ExportacaoPDFService } from './exportacao/pdf/exportacao-pdf.service';
import { ExportacaoXLSService } from './exportacao/xls/exportacao-xls.service';

describe('ExportacaoService', () => {
  let service: ExportacaoService;
  let csvServiceSpy: jasmine.SpyObj<ExportacaoCSVService>;
  let pdfServiceSpy: jasmine.SpyObj<ExportacaoPDFService>;
  let xlsServiceSpy: jasmine.SpyObj<ExportacaoXLSService>;

  beforeEach(() => {
    const csvSpy = { exportar: jest.fn() };
    const pdfSpy = { exportar: jest.fn() };
    const xlsSpy = { exportar: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        ExportacaoService,
        { provide: ExportacaoCSVService, useValue: csvSpy },
        { provide: ExportacaoPDFService, useValue: pdfSpy },
        { provide: ExportacaoXLSService, useValue: xlsSpy }
      ]
    });

    service = TestBed.inject(ExportacaoService);
    csvServiceSpy = TestBed.inject(ExportacaoCSVService) as jasmine.SpyObj<ExportacaoCSVService>;
    pdfServiceSpy = TestBed.inject(ExportacaoPDFService) as jasmine.SpyObj<ExportacaoPDFService>;
    xlsServiceSpy = TestBed.inject(ExportacaoXLSService) as jasmine.SpyObj<ExportacaoXLSService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call exportarCSV method of ExportacaoCSVService', () => {
    const endpoint = 'test-endpoint';
    const body = { key: 'value' };
    csvServiceSpy.exportar.mockReturnValue(of({}));

    service.exportarCSV(endpoint, body).subscribe(response => {
      expect(response).toEqual({});
    });

    expect(csvServiceSpy.exportar).toHaveBeenCalledWith(endpoint, body);
  });

  it('should call exportarPDF method of ExportacaoPDFService', () => {
    const endpoint = 'test-endpoint';
    const body = { key: 'value' };
    pdfServiceSpy.exportar.mockReturnValue(of({}));

    service.exportarPDF(endpoint, body).subscribe(response => {
      expect(response).toEqual({});
    });

    expect(pdfServiceSpy.exportar).toHaveBeenCalledWith(endpoint, body);
  });

  it('should call exportarXLS method of ExportacaoXLSService', () => {
    const endpoint = 'test-endpoint';
    const body = { key: 'value' };
    xlsServiceSpy.exportar.mockReturnValue(of({}));

    service.exportarXLS(endpoint, body).subscribe(response => {
      expect(response).toEqual({});
    });

    expect(xlsServiceSpy.exportar).toHaveBeenCalledWith(endpoint, body);
  });
});
