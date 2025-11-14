import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LaboratorioService } from './laboratorio.service';
import { MessageService } from '../../components/messages/message.service';
import { Laboratorio } from '../../../../app/shared/models/entidades';

describe('LaboratorioService', () => {
  let service: LaboratorioService;
  let httpMock: HttpTestingController;
  const baseUrl = '/siasc-api/api/laboratorios';
  const messageServiceSpy = { getDescription: jest.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        LaboratorioService,
        { provide: MessageService, useValue: messageServiceSpy },
      ]
    });

    service = TestBed.inject(LaboratorioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch laboratorios by patologia id', () => {
    const dummyLaboratorios: Laboratorio[] = [
      { id: 1, nome: 'Lab 1' },
      { id: 2, nome: 'Lab 2' }
    ];

    service.carregarPorPatologia(1).subscribe(laboratorios => {
      expect(laboratorios.length).toBe(2);
      expect(laboratorios).toEqual(dummyLaboratorios);
    });

    const req = httpMock.expectOne(`${baseUrl}/1/patologia`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyLaboratorios);
  });
});
