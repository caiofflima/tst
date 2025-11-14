import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MessageService } from '../../components/messages/message.service';
import { ListaRestritiva } from '../../../../app/shared/models/lista-restritiva';
import { ListaRestritivaService } from './lista.restritiva.service';

describe('ListaRestritivaService', () => {
  let service: ListaRestritivaService;
  let httpMock: HttpTestingController;
  const messageServiceSpy = { getDescription: jest.fn() };
  const baseUrl = '/siasc-api/api/cadastrobasico/lista-restritiva';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ListaRestritivaService,
        { provide: MessageService, useValue: messageServiceSpy }
      ]
    });
    service = TestBed.inject(ListaRestritivaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should filter lista restritiva', () => {
    const mockResponse: Array<ListaRestritiva> = [];
    const listaRestritiva: ListaRestritiva = {} as ListaRestritiva;

    service.filtrar(listaRestritiva).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(baseUrl + '/filtrar');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should list all lista restritiva', () => {
    const mockResponse: Array<ListaRestritiva> = [];

    service.listarTodos().subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(baseUrl + '/listar-todos');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should update lista restritiva', () => {
    const mockResponse = true;
    const listaRestritiva: ListaRestritiva = {} as ListaRestritiva ;

    service.atualizar(listaRestritiva).subscribe((res) => {
      expect(res).toBe(mockResponse);
    });

    const req = httpMock.expectOne(baseUrl + '/atualizar');
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);
  });

  it('should get lista restritiva by id', () => {
    const mockResponse: ListaRestritiva = {} as ListaRestritiva ;
    const id = 1;

    service.consultaPorId(id).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(baseUrl + '/consulta-por-id/' + id);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should remove lista restritiva', () => {
    const mockResponse = true;
    const listaRestritiva = { id: 1 };

    service.remover(listaRestritiva).subscribe((res) => {
      expect(res).toBe(mockResponse);
    });

    const req = httpMock.expectOne(baseUrl + '/remover/' + listaRestritiva.id);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });
});
