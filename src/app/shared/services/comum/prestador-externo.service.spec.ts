import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PrestadorExternoService } from './prestador-externo.service';
import { MessageService } from '../../components/messages/message.service';
import { FiltroConsultaPrestadorExterno } from '../../models/filtro/filtro-consulta-prestador-externo';
import { PrestadorExterno } from '../../../../app/shared/models/comum/prestador-externo';

describe('PrestadorExternoService', () => {
  let service: PrestadorExternoService;
  let httpMock: HttpTestingController;
  const baseUrl = '/siasc-api/api/prestadores-externos';
  const messageServiceSpy = { getDescription: jest.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PrestadorExternoService, 
        { provide: MessageService, useValue: messageServiceSpy },
      ]
    });

    service = TestBed.inject(PrestadorExternoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call consultarPorCPF and return the result', () => {
    const dummyResponse = { data: 'test' };
    const cpf = '12345678901';

    service.consultarPorCPF(cpf).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/cpf/${cpf}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });

  it('should call consultarPorCpfAlteracao and return the result', () => {
    const dummyResponse = { data: 'test' };
    const cpf = '12345678901';
    const id = 1;

    service.consultarPorCpfAlteracao(cpf, id).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/cpf/${cpf}/id/${id}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });

  it('should call consultarPorIdCredenciado and return the result', () => {
    const dummyResponse = { data: 'test' };
    const idCredenciado = 1;

    service.consultarPorIdCredenciado(idCredenciado).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/operadores/${idCredenciado}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });

  it('should call consultarPorId and return the result', () => {
    const dummyResponse = { data: 'test' };
    const id = 1;

    service.consultarPorId(id).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/${id}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });

  it('should call consultarPorFiltro and return the result', () => {
    const dummyResponse = { data: 'test' };
    const filtro: FiltroConsultaPrestadorExterno = {} as FiltroConsultaPrestadorExterno;

    service.consultarPorFiltro(filtro).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/consulta/filtro`);
    expect(req.request.method).toBe('POST');
    req.flush(dummyResponse);
  });

  it('should call salvar and return the result', () => {
    const dummyResponse = { data: 'test' };
    const prestador: PrestadorExterno = {} as PrestadorExterno;

    service.salvar(prestador).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    req.flush(dummyResponse);
  });

  it('should call alterarStatus and return the result', () => {
    const dummyResponse = { data: 'test' };
    const id = 1;
    const status = 'active';

    service.alterarStatus(id, status).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/id/${id}/status/${status}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });
});
