import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EmpresaPrestadorExternoService } from './empresa-prestador-externo.service';
import { MessageService } from '../../components/messages/message.service';
import { EmpresaPrestadora } from '../../../../app/shared/models/comum/empresa-prestadora';

describe('EmpresaPrestadorExternoService', () => {
  let service: EmpresaPrestadorExternoService;
  let httpMock: HttpTestingController;
  const baseUrl = '/siasc-api/api/empresas-prestadoras';
  const messageServiceSpy = jasmine.createSpyObj('MessageService',['getDescription']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EmpresaPrestadorExternoService, 
        { provide: MessageService, useValue: messageServiceSpy }
      ]
    });

    service = TestBed.inject(EmpresaPrestadorExternoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch empresa by id', () => {
    const dummyEmpresa: EmpresaPrestadora = {} as EmpresaPrestadora;

    service.consultarEmpresaPorId(1).subscribe(empresa => {
      expect(empresa).toEqual(dummyEmpresa);
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyEmpresa);
  });

  it('should fetch filiais', () => {
    const dummyFiliais = [{ id: 1, nome: 'Filial Teste' }];

    service.consultarFiliais().subscribe(filiais => {
      expect(filiais).toEqual(dummyFiliais);
    });

    const req = httpMock.expectOne(`${baseUrl}/filiais/`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyFiliais);
  });

  it('should delete empresa by id', () => {
    service.excluirEmpresa(1).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should fetch empresas by filtro', () => {
    const dummyEmpresas: EmpresaPrestadora[] = [];
    const filtro = { nome: 'Teste' };

    service.consultarPorFiltro(filtro).subscribe(empresas => {
      expect(empresas).toEqual(dummyEmpresas);
    });

    const req = httpMock.expectOne(`${baseUrl}/filtro`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(filtro);
    req.flush(dummyEmpresas);
  });

  it('should save empresa', () => {
    const dummyEmpresa: EmpresaPrestadora = {} as EmpresaPrestadora;

    service.salvar(dummyEmpresa).subscribe(response => {
      expect(response).toEqual(dummyEmpresa);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dummyEmpresa);
    req.flush(dummyEmpresa);
  });

  it('should fetch all empresas', () => {
    const dummyEmpresas = [{ id: 1, nome: 'Empresa Teste' }];

    service.buscarEmpresas().subscribe(empresas => {
      expect(empresas).toEqual(dummyEmpresas);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(dummyEmpresas);
  });
});
