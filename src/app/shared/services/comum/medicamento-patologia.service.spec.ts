import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MedicamentoPatologiaService } from './medicamento-patologia.service';
import { MedicamentoPatologia } from '../../models/comum/medicamento-patologia';
import { MessageService } from '../../components/messages/message.service';

describe('MedicamentoPatologiaService', () => {
  let service: MedicamentoPatologiaService;
  let httpMock: HttpTestingController;
  const baseUrl = '/siasc-api/api/medicamentos-patologias';
  const messageServiceSpy = { getDescription: jest.fn() };

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        MedicamentoPatologiaService,
        { provide: MessageService, useValue: messageServiceSpy }
      ]
    });

    service = TestBed.inject(MedicamentoPatologiaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#consultarPorFiltro', () => {
    it('should call the API with the correct parameters', () => {
      const dummyData: MedicamentoPatologia[] = [
        {} as MedicamentoPatologia
      ];

      service.consultarPorFiltro(1, 1, true).subscribe(data => {
        expect(data).toEqual(dummyData);
      });

      const req = httpMock.expectOne(req => 
        req.url === `${baseUrl}` &&
        req.params.get('idPatologia') === '1' &&
        req.params.get('idMedicamento') === '1' &&
        req.params.get('ativo') === 'true'
      );

      expect(req.request.method).toBe('GET');
      req.flush(dummyData);
    });
  });

  describe('#excluir', () => {
    it('should call the API to delete the correct item', () => {
      const idMedicamentoPatologia = 1;

      service.excluir(idMedicamentoPatologia).subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(`${baseUrl}/${idMedicamentoPatologia}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });
});
