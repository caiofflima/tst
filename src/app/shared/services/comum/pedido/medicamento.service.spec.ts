import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MedicamentoService } from './medicamento.service';
import { MessageService, PrestadorExternoService, SessaoService } from '../../services';
import { Medicamento } from '../../../models/comum/medicamento';
import { of } from 'rxjs';

describe('MedicamentoService', () => {
  let service: MedicamentoService;
  let httpMock: HttpTestingController;
  const messageServiceSpy = { getDescription: jest.fn() };
  const sessaoServiceSpy = { getDescription: jest.fn() };
  const prestadorExternoServiceSpy = { get: jest.fn(), consultarUsuarioExternoPorFiltro: jest.fn() };
  prestadorExternoServiceSpy.consultarUsuarioExternoPorFiltro.mockReturnValue(of({})

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MedicamentoService,
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: SessaoService, useValue: sessaoServiceSpy },
        {provide: PrestadorExternoService, useValue: prestadorExternoServiceSpy },

      ]
    }));

    service = TestBed.inject(MedicamentoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load medicamentos by laboratorioId and idPatologia', () => {
    const dummyMedicamentos: Medicamento[] = [{ id: 1, nome: 'Medicamento 1' }, { id: 2, nome: 'Medicamento 2' }];
    service.carregarPor(1, 2).subscribe(medicamentos => {
      expect(medicamentos.length).toBe(2);
      expect(medicamentos).toEqual(dummyMedicamentos);
    });

    const req = httpMock.expectOne(req => req.url.includes('buscarMedicamentoPor'));
    expect(req.request.method).toBe('GET');
    req.flush(dummyMedicamentos);
  });

  it('should load medicamentos by idPatologia', () => {
    const dummyMedicamentos: Medicamento[] = [{ id: 1, nome: 'Medicamento 1' }];
    service.carregarPorPatologia(1).subscribe(medicamentos => {
      expect(medicamentos.length).toBe(1);
      expect(medicamentos).toEqual(dummyMedicamentos);
    });

    const req = httpMock.expectOne(req => req.url.includes('1/patologia'));
    expect(req.request.method).toBe('GET');
    req.flush(dummyMedicamentos);
  });

  it('should load apresentacao by medicamentoId and idPatologia', () => {
    const dummyMedicamentos: Medicamento[] = [{ id: 1, nome: 'Medicamento 1' }];
    service.carregarApresentacao(1, 2).subscribe(medicamentos => {
      expect(medicamentos.length).toBe(1);
      expect(medicamentos).toEqual(dummyMedicamentos);
    });

    const req = httpMock.expectOne(req => req.url.includes('1/apresentacoes'));
    expect(req.request.method).toBe('GET');
    req.flush(dummyMedicamentos);
  });

  it('should return empty observable if medicamentoId is not provided', () => {
    service.carregarApresentacao(null, 2).subscribe(medicamentos => {
      expect(medicamentos).toEqual([]);
    });
  });

  it('should load all medicamentos', () => {
    const dummyMedicamentos: Medicamento[] = [{ id: 1, nome: 'Medicamento 1' }];
    service.consultarTodos().subscribe(medicamentos => {
      expect(medicamentos.length).toBe(1);
      expect(medicamentos).toEqual(dummyMedicamentos);
    });

    const req = httpMock.expectOne(req => req.url.includes('buscarMedicamentoPor'));
    expect(req.request.method).toBe('GET');
    req.flush(dummyMedicamentos);
  });

  it('should load all active medicamentos', () => {
    const dummyMedicamentos: Medicamento[] = [{ id: 1, nome: 'Medicamento 1' }];
    service.consultarTodosMedicamentosAtivos(true).subscribe(medicamentos => {
      expect(medicamentos.length).toBe(1);
      expect(medicamentos).toEqual(dummyMedicamentos);
    });

    const req = httpMock.expectOne(req => req.url.includes('consultarTodosMedicamentosAtivos/true'));
    expect(req.request.method).toBe('GET');
    req.flush(dummyMedicamentos);
  });

  it('should filter medicamentos by value', () => {
    const dummyMedicamentos: Medicamento[] = [{ id: 1, nome: 'Medicamento 1' }];
    service.consultar('value').subscribe(medicamentos => {
      expect(medicamentos.length).toBe(1);
      expect(medicamentos).toEqual(dummyMedicamentos);
    });

    const req = httpMock.expectOne(req => req.url.includes('filtro/value'));
    expect(req.request.method).toBe('GET');
    req.flush(dummyMedicamentos);
  });

  it('should load medicamento by id', () => {
    const dummyMedicamento: Medicamento = { id: 1, nome: 'Medicamento 1' };
    service.consultarPorId(1).subscribe(medicamento => {
      expect(medicamento).toEqual(dummyMedicamento);
    });

    const req = httpMock.expectOne(req => req.url.includes('1'));
    expect(req.request.method).toBe('GET');
    req.flush(dummyMedicamento);
  });
});
