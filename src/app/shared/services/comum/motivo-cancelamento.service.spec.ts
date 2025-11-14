import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MotivoCancelamentoService } from './motivo-cancelamento.service';
import { MessageService } from '../../components/messages/message.service';
import { MotivoCancelamento } from '../../../../app/shared/models/comum/motivo-cancelamento';

describe('MotivoCancelamentoService', () => {
  let service: MotivoCancelamentoService;
  let httpMock: HttpTestingController;
  const baseUrl = '/siasc-api/api/motivo-cancelamento';
  const messageServiceSpy = { getDescription: jest.fn() };

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        MotivoCancelamentoService,
        { provide: MessageService, useValue: messageServiceSpy }
      ]
    });

    service = TestBed.inject(MotivoCancelamentoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all MotivoCancelamento', () => {
    const dummyMotivos: MotivoCancelamento[] = [
      {} as MotivoCancelamento,
      {} as MotivoCancelamento
    ];

    service.consultarTodos().subscribe(motivos => {
      expect(motivos.length).toBe(2);
      expect(motivos).toEqual(dummyMotivos);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(dummyMotivos);
  });

  it('should fetch a single MotivoCancelamento by id', () => {
    const dummyMotivo: MotivoCancelamento = {} as MotivoCancelamento;

    service.consultarPorId(1).subscribe(motivo => {
      expect(motivo).toEqual(dummyMotivo);
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyMotivo);
  });
});
