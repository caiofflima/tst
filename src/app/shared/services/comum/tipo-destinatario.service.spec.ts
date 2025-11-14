import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TipoDestinatarioService } from './tipo-destinatario.service';
import { MessageService } from '../../components/messages/message.service';
import { TipoDestinatario } from '../../../../app/shared/models/comum/tipo-destinatario';
import { PrestadorExternoService } from './prestador-externo.service';
import { of } from 'rxjs';

describe('TipoDestinatarioService', () => {
  let service: TipoDestinatarioService;
  let httpMock: HttpTestingController;
  const baseUrl = '/siasc-api/api/tipos-destinatario';
  const messageServiceSpy = { getDescription: jest.fn() };
  const prestadorExternoServiceSpy = { get: jest.fn(), consultarUsuarioExternoPorFiltro: jest.fn() };
  prestadorExternoServiceSpy.consultarUsuarioExternoPorFiltro.mockReturnValue(of({})

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TipoDestinatarioService,
        { provide: MessageService, useValue: messageServiceSpy },
        {provide: PrestadorExternoService, useValue: prestadorExternoServiceSpy },

      ]
    });
    service = TestBed.inject(TipoDestinatarioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all TipoDestinatario via GET', () => {
    const dummyDestinatarios: TipoDestinatario[] = [
      {} as TipoDestinatario,
      {} as TipoDestinatario
    ];

    service.consultarTodos().subscribe(destinatarios => {
      expect(destinatarios.length).toBe(2);
      expect(destinatarios).toEqual(dummyDestinatarios);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(dummyDestinatarios);
  });

  it('should add a TipoDestinatario via POST', () => {
    const newDestinatario: TipoDestinatario = {} as TipoDestinatario;

    service.post(newDestinatario).subscribe(destinatario => {
      expect(destinatario).toEqual(newDestinatario);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    req.flush(newDestinatario);
  });

  it('should update a TipoDestinatario via PUT', () => {
    const updatedDestinatario: TipoDestinatario = {} as TipoDestinatario;

    service.put(updatedDestinatario).subscribe(destinatario => {
      expect(destinatario).toEqual(updatedDestinatario);
    });

    const req = httpMock.expectOne(`${baseUrl}`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedDestinatario);
  });

  it('should delete a TipoDestinatario via DELETE', () => {
    const id = 1;

    service.delete(id).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${baseUrl}/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
