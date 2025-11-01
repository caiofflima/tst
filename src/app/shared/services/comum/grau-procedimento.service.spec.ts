import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GrauProcedimentoService } from './grau-procedimento.service';
import { MessageService } from '../../components/messages/message.service';
import { GrauProcedimento } from '../../models/comum/grau-procedimento';

describe('GrauProcedimentoService', () => {
  let service: GrauProcedimentoService;
  let httpMock: HttpTestingController;
  const baseUrl = '/siasc-api/api/graus-procedimento';
  const messageServiceSpy = jasmine.createSpyObj('MessageService',['getDescription']);

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        GrauProcedimentoService,
        { provide: MessageService, useValue: messageServiceSpy }
      ]
    });

    service = TestBed.inject(GrauProcedimentoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#consultarPorId', () => {
    it('should return an Observable<GrauProcedimento> when idGrau and idProcedimento are provided', () => {
      const dummyGrauProcedimento: GrauProcedimento = {} as GrauProcedimento;

      service.consultarPorId(1, 1).subscribe(grauProcedimento => {
        expect(grauProcedimento).toEqual(dummyGrauProcedimento);
      });

      const req = httpMock.expectOne(`${baseUrl}/1/1`);
      expect(req.request.method).toBe('GET');
      req.flush(dummyGrauProcedimento);
    });

    it('should return an empty Observable when idGrau or idProcedimento are not provided', () => {
      service.consultarPorId(null, 1).subscribe(result => {
        expect(result).toBeUndefined();
      });

      service.consultarPorId(1, null).subscribe(result => {
        expect(result).toBeUndefined();
      });

      httpMock.expectNone(`${baseUrl}/null/1`);
      httpMock.expectNone(`${baseUrl}/1/null`);
    });
  });

  describe('#consultarPorProcedimento', () => {
    it('should return an Observable<any> when idProcedimento is provided', () => {
      const dummyResponse = { data: 'test' };

      service.consultarPorProcedimento(1).subscribe(response => {
        expect(response).toEqual(dummyResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}/procedimento/1`);
      expect(req.request.method).toBe('GET');
      req.flush(dummyResponse);
    });
  });
});
