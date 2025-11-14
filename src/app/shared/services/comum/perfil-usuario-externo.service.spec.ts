import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PerfilUsuarioExternoService } from './perfil-usuario-externo.service';
import { MessageService } from '../../components/messages/message.service';
import { PerfilPrestadorEmpresaSaveDTO } from '../../../../app/shared/models/dto/perfil-prestador-empresa-save';

describe('PerfilUsuarioExternoService', () => {
  let service: PerfilUsuarioExternoService;
  let httpMock: HttpTestingController;
  const baseUrl = '/siasc-api/api/perfis-prestadores-empresas';
  const messageServiceSpy = { getDescription: jest.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PerfilUsuarioExternoService,
        { provide: MessageService, useValue: messageServiceSpy }
      ]
    });

    service = TestBed.inject(PerfilUsuarioExternoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call consultarPorFiltro and return the result', () => {
    const dummyResponse = { data: 'test' };
    const filtro = { name: 'test' };

    service.consultarPorFiltro(filtro).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/consulta/filtro/`);
    expect(req.request.method).toBe('POST');
    req.flush(dummyResponse);
  });

  it('should call salvar and return the result', () => {
    const dummyResponse = { data: 'test' };
    const perfilprestador: PerfilPrestadorEmpresaSaveDTO = {} as PerfilPrestadorEmpresaSaveDTO;

    service.salvar(perfilprestador).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    req.flush(dummyResponse);
  });

  it('should call removerCredenciais and return the result', () => {
    const dummyResponse = { data: 'test' };
    const perfisPrestadoresEmpresas = [{ id: 1 }, { id: 2 }];

    service.removerCredenciais(perfisPrestadoresEmpresas).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/remover-credenciais`);
    expect(req.request.method).toBe('POST');
    req.flush(dummyResponse);
  });
});
