import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TipoDependenteService, } from './tipo-dependente.service';
import { MessageService } from '../../components/messages/message.service';
import { TipoDependente } from '../../../../app/shared/models/comum/tipo-dependente';
import { TipoBeneficiarioDTO } from '../../../../app/shared/models/dto/tipo-beneficiario';
import { of } from 'rxjs';
import { PrestadorExternoService } from './prestador-externo.service';

describe('TipoDependenteService', () => {
  let service: TipoDependenteService;
  let httpMock: HttpTestingController;
  const baseUrl = '/siasc-api/api/tipos-dependente';
  const messageServiceSpy = { getDescription: jest.fn() };
  const prestadorExternoServiceSpy = { get: jest.fn(), consultarUsuarioExternoPorFiltro: jest.fn() };
  prestadorExternoServiceSpy.consultarUsuarioExternoPorFiltro.mockReturnValue(of({}));
  const dummyDependents: TipoDependente[] = [
    {} as TipoDependente,
    {} as TipoDependente
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ TipoDependenteService,
        { provide: MessageService, useValue: messageServiceSpy },
        {provide: PrestadorExternoService, useValue: prestadorExternoServiceSpy },

      ]
    });

    service = TestBed.inject(TipoDependenteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all dependents', () => {
    const dummyDependents: TipoDependente[] = [
      {} as TipoDependente,
      {} as TipoDependente
    ];

    service.consultarTodos(true, '12345', '2023-01-01').subscribe(dependents => {
      expect(dependents.length).toBe(2);
      expect(dependents).toEqual(dummyDependents);
    });

    const req = httpMock.expectOne(`${baseUrl}?titular=true&matricula=12345&inclusao=2023-01-01`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyDependents);
  });

  it('should fetch dependents by beneficiary ID', () => {
    service.consultarTodosIdBeneficiario(true, '12345', '2023-01-01').subscribe(dependents => {
      expect(dependents.length).toBe(2);
      expect(dependents).toEqual(dummyDependents);
    });

    const req = httpMock.expectOne(`${baseUrl}/beneficiario/true/12345/2023-01-01`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyDependents);
  });

  it('should fetch dependents by relation', () => {
    service.consultarPorRelacao(1).subscribe(dependents => {
      expect(dependents.length).toBe(2);
      expect(dependents).toEqual(dummyDependents);
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyDependents);
  });

  it('should fetch dependent type by beneficiary ID', () => {
    const dummyBeneficiary: TipoBeneficiarioDTO = {} as TipoBeneficiarioDTO;

    service.consultarTipoDependente(1).subscribe(beneficiary => {
      expect(beneficiary).toEqual(dummyBeneficiary);
    });

    const req = httpMock.expectOne(`${baseUrl}/consultarTipoDependente/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyBeneficiary);
  });
});
