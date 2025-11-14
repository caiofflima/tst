import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProfissionalExecutanteService } from './profissional-executante.service';
import { MessageService } from '../../components/messages/message.service';

describe('ProfissionalExecutanteService', () => {
  let service: ProfissionalExecutanteService;
  let httpMock: HttpTestingController;
  const baseUrl = '/siasc-api/api/profissionais-executantes';
  const messageServiceSpy = { getDescription: jest.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProfissionalExecutanteService, 
        { provide: MessageService, useValue: messageServiceSpy },
      ]
    });

    service = TestBed.inject(ProfissionalExecutanteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call consultarPorCNPJ and return the expected result', () => {
    const dummyResponse = { data: 'test' };
    const cnpj = '12345678901234';

    service['consultarPorCNPJ'](cnpj).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/cnpj/${cnpj}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });

  it('should call consultarPorCPF and return the expected result', () => {
    const dummyResponse = { data: 'test' };
    const cpf = '12345678901';

    service['consultarPorCPF'](cpf).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/cpf/${cpf}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });
});
