import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MessageService } from '../../components/messages/message.service';
import { InscricaoProgramasMedicamentosService } from './inscricao-programas-medicamento.service';

describe('InscricaoProgramasMedicamentosService', () => {
  let service: InscricaoProgramasMedicamentosService;
  let httpMock: HttpTestingController;
  const baseUrl = '/siasc-api/api/inscricao-programas-medicamentos';
  const messageServiceSpy = { getDescription: jest.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [InscricaoProgramasMedicamentosService, 
        { provide: MessageService, useValue: messageServiceSpy }
      ]
    });

    service = TestBed.inject(InscricaoProgramasMedicamentosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call salvar and return the result', () => {
    const formData = new FormData();
    const mockResponse = { success: true };

    service.salvar(formData).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should call atualizar and return the result', () => {
    const formData = new FormData();
    const mockResponse = { success: true };

    service.atualizar(formData).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);
  });
});
