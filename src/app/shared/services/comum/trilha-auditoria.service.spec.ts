import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TrilhaAuditoriaService } from './trilha-auditoria.service';
import { MessageService } from '../../components/messages/message.service';
import { ModuloTrilhaDTO, ParamsTrilhaAuditoriaDTO } from '../../../../app/shared/models/dtos';
import { of } from 'rxjs';
import { PrestadorExternoService } from './prestador-externo.service';

describe('TrilhaAuditoriaService', () => {
  let service: TrilhaAuditoriaService;
  let httpMock: HttpTestingController;
  const baseUrl = '/siasc-api/api/trilha-auditoria';
  const messageServiceSpy = { getDescription: jest.fn() };
  const prestadorExternoServiceSpy = { get: jest.fn(), consultarUsuarioExternoPorFiltro: jest.fn() };
  prestadorExternoServiceSpy.consultarUsuarioExternoPorFiltro.mockReturnValue(of({})

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TrilhaAuditoriaService, 
        { provide: MessageService, useValue: messageServiceSpy },
        {provide: PrestadorExternoService, useValue: prestadorExternoServiceSpy },

      ]
    }));

    service = TestBed.inject(TrilhaAuditoriaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load modules', () => {
    const dummyModules: ModuloTrilhaDTO[] = [
      {} as ModuloTrilhaDTO,
      {} as ModuloTrilhaDTO
    ];

    service.carregarModulos().subscribe(modules => {
      expect(modules.length).toBe(2);
      expect(modules).toEqual(dummyModules);
    });

    const req = httpMock.expectOne(`${baseUrl}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyModules);
  });

  it('should consult trail by parameters', () => {
    const params: ParamsTrilhaAuditoriaDTO = {} as ParamsTrilhaAuditoriaDTO;
    const dummyResponse: ModuloTrilhaDTO[] = [
      {} as ModuloTrilhaDTO,
      {} as ModuloTrilhaDTO,
    ];

    service.consultarTrilhaPorParametros(params).subscribe(response => {
      expect(response.length).toBe(2);
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/consulta-trilha`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(params);
    req.flush(dummyResponse);
  });
});
