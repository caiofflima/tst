import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConselhoProfissionalService } from './conselho-profissional.service';
import { MessageService } from '../../components/messages/message.service';
import { ConselhoProfissional } from '../../models/comum/conselho-profissional';

describe('ConselhoProfissionalService', () => {
  let service: ConselhoProfissionalService;
  let httpMock: HttpTestingController;
  const baseUrl = '/siasc-api/api/conselhos-profissionais';
  const messageServiceSpy = { getDescription: jest.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ConselhoProfissionalService, 
        { provide: MessageService, useValue: messageServiceSpy }
      ]
    });

    service = TestBed.inject(ConselhoProfissionalService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch conselho profissional by idPedido', () => {
    const dummyConselho: ConselhoProfissional = {} as ConselhoProfissional;
    const idPedido = 1;

    service.consultarConselhosProfissionaisPorIdPedido(idPedido).subscribe(conselho => {
      expect(conselho).toEqual(dummyConselho);
    });

    const req = httpMock.expectOne(`${baseUrl}/pedido/${idPedido}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyConselho);
  });

  it('should fetch conselho profissional by id', () => {
    const dummyConselho: ConselhoProfissional = {}  as ConselhoProfissional;;
    const id = 1;

    service.consultarConselhosProfissionaisPorId(id).subscribe(conselho => {
      expect(conselho).toEqual(dummyConselho);
    });

    const req = httpMock.expectOne(`${baseUrl}/${id}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyConselho);
  });

  it('should return empty observable if id is not provided', () => {
    service.consultarConselhosProfissionaisPorId(null).subscribe(conselho => {
      expect(conselho).toBeUndefined();
    });

    httpMock.expectNone(`${baseUrl}/null`);
  });
});
