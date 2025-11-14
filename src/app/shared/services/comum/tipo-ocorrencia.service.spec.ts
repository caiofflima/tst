import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TipoOcorrenciaService } from './tipo-ocorrencia.service';
import { MessageService } from '../../components/messages/message.service';
import { TipoOcorrencia } from '../../models/dto/tipo-ocorrencia';
import { of } from 'rxjs';
import { PrestadorExternoService } from './prestador-externo.service';

describe('TipoOcorrenciaService', () => {
  let service: TipoOcorrenciaService;
  let httpMock: HttpTestingController;
  const baseUrl = '/siasc-api/api/tipos-ocorrencia';
  const messageServiceSpy = { getDescription: jest.fn() };
  const prestadorExternoServiceSpy = { get: jest.fn(), consultarUsuarioExternoPorFiltro: jest.fn() };
  prestadorExternoServiceSpy.consultarUsuarioExternoPorFiltro.mockReturnValue(of({}));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TipoOcorrenciaService,
        { provide: MessageService, useValue: messageServiceSpy },
        {provide: PrestadorExternoService, useValue: prestadorExternoServiceSpy },

      ]
    });
    service = TestBed.inject(TipoOcorrenciaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch manual occurrence types', () => {
    const dummyTiposOcorrencia: TipoOcorrencia[] = [
      { id: 1, nome: 'Tipo 1' },
      { id: 2, nome: 'Tipo 2' }
    ];

    service.consultarTiposOcorrenciaManuais().subscribe(tiposOcorrencia => {
      expect(tiposOcorrencia.length).toBe(2);
      expect(tiposOcorrencia).toEqual(dummyTiposOcorrencia);
    });

    const req = httpMock.expectOne(`${baseUrl}/manuais`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyTiposOcorrencia);
  });
});
