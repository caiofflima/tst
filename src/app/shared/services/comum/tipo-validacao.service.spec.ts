import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TipoValidacaoService } from './tipo-validacao.service';
import { MessageService } from '../../components/messages/message.service';
import { TipoValidacaoDTO } from '../../models/dto/tipo-validacao';
import { of } from 'rxjs';
import { PrestadorExternoService } from './prestador-externo.service';

describe('TipoValidacaoService', () => {
  let service: TipoValidacaoService;
  let httpMock: HttpTestingController;
  const baseUrl = '/siasc-api/api/tipos-validacao';
  const messageServiceSpy = jasmine.createSpyObj('MessageService',['getDescription']);
  const prestadorExternoServiceSpy = jasmine.createSpyObj('PrestadorExternoService',['get','consultarUsuarioExternoPorFiltro']);
  prestadorExternoServiceSpy.consultarUsuarioExternoPorFiltro = of({})

  beforeEach(() => {
    const spy = jasmine.createSpyObj('MessageService', ['add']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TipoValidacaoService,
        { provide: MessageService, useValue: messageServiceSpy },
        {provide: PrestadorExternoService, useValue: prestadorExternoServiceSpy },

      ]
    });

    service = TestBed.inject(TipoValidacaoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch a list of TipoValidacaoDTO', () => {
    const dummyTipos: TipoValidacaoDTO[] = [
      { id: 1, nome: 'Tipo 1' },
      { id: 2, nome: 'Tipo 2' }
    ];

    service.get().subscribe((tipos : any[]) => {
      expect(tipos.length).toBe(2);
      expect(tipos).toEqual(dummyTipos);
    });

    const req = httpMock.expectOne(`${baseUrl}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyTipos);
  });

  it('should delete a TipoValidacaoDTO', () => {
    const id = 1;

    service.delete(id).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
