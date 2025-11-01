import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EspecialidadeService } from './especialidade.service';
import { MessageService, PrestadorExternoService, SessaoService } from '../../services';
import { Especialidade } from '../../../models/credenciados/especialidade';
import { of } from 'rxjs';

describe('EspecialidadeService', () => {
  let service: EspecialidadeService;
  let httpMock: HttpTestingController;
  const baseUrl = '/siasc-api/api/pedido/especialidade';
  const messageServiceSpy = jasmine.createSpyObj('MessageService',['getDescription']);
  const sessaoServiceSpy = jasmine.createSpyObj('SessaoService',['getDescription']);
  const prestadorExternoServiceSpy = jasmine.createSpyObj('PrestadorExternoService',['get','consultarUsuarioExternoPorFiltro']);
  prestadorExternoServiceSpy.consultarUsuarioExternoPorFiltro = of({})

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        EspecialidadeService,
        { provide: MessageService, useValue: messageServiceSpy },
        {provide: PrestadorExternoService, useValue: prestadorExternoServiceSpy },

        { provide: SessaoService, useValue: sessaoServiceSpy }
      ]
    });

    service = TestBed.inject(EspecialidadeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch especialidades by procedimento id', () => {
    const dummyEspecialidades: Especialidade[] = [
      { id: 1, nome: 'Cardiologia' },
      { id: 2, nome: 'Neurologia' }
    ];

    service.carregarPorProcedimento(1).subscribe(especialidades => {
      expect(especialidades.length).toBe(2);
      expect(especialidades).toEqual(dummyEspecialidades);
    });

    const req = httpMock.expectOne(`${baseUrl}?idProcedimento=1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyEspecialidades);
  });

  it('should fetch especialidade by id', () => {
    const dummyEspecialidade: Especialidade = { id: 1, nome: 'Cardiologia' };

    service.carregarPorId(1).subscribe(especialidade => {
      expect(especialidade).toEqual(dummyEspecialidade);
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyEspecialidade);
  });
});
