import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TipoDeficienciaService } from './tipo-deficiencia.service';
import { MessageService } from '../../components/messages/message.service';
import { TipoDeficiencia } from '../../../../app/shared/models/comum/tipo-deficiencia';
import { of } from 'rxjs';
import { PrestadorExternoService } from './prestador-externo.service';

describe('TipoDeficienciaService', () => {
  let service: TipoDeficienciaService;
  let httpMock: HttpTestingController;
  const baseUrl = '/siasc-api/api/tipos-deficiencia';
  const messageServiceSpy = jasmine.createSpyObj('MessageService',['getDescription']);
  const prestadorExternoServiceSpy = jasmine.createSpyObj('PrestadorExternoService',['get','consultarUsuarioExternoPorFiltro']);
  prestadorExternoServiceSpy.consultarUsuarioExternoPorFiltro = of({})

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TipoDeficienciaService,
        { provide: MessageService, useValue: messageServiceSpy },
        {provide: PrestadorExternoService, useValue: prestadorExternoServiceSpy },

      ]
    });

    service = TestBed.inject(TipoDeficienciaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all TipoDeficiencia', () => {
    const dummyTiposDeficiencia: TipoDeficiencia[] = [
      {} as TipoDeficiencia,
      {} as TipoDeficiencia
    ];

    service.consultarTodos().subscribe(tiposDeficiencia => {
      expect(tiposDeficiencia.length).toBe(2);
      expect(tiposDeficiencia).toEqual(dummyTiposDeficiencia);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(dummyTiposDeficiencia);
  });

  it('should handle error when fetching all TipoDeficiencia', () => {
    const errorMessage = 'Error fetching data';

    service.consultarTodos().subscribe(
      () => fail('expected an error, not TipoDeficiencia'),
      error => expect(error.message).toContain(errorMessage)
    );

    const req = httpMock.expectOne(baseUrl);
    req.flush(errorMessage, { status: 500, statusText: 'Error fetching data' });
  });
});
