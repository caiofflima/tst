import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TipoBeneficiarioService } from './tipo-beneficiario.service';
import { MessageService } from '../../components/messages/message.service';
import { DadoComboDTO } from '../../models/dto/dado-combo';
import { of } from 'rxjs';
import { PrestadorExternoService } from './prestador-externo.service';

describe('TipoBeneficiarioService', () => {
  let service: TipoBeneficiarioService;
  let httpMock: HttpTestingController;
  const baseUrl = '/siasc-api/api/combos';
  const messageServiceSpy = { getDescription: jest.fn() };
  const prestadorExternoServiceSpy = { get: jest.fn(), consultarUsuarioExternoPorFiltro: jest.fn() };
  prestadorExternoServiceSpy.consultarUsuarioExternoPorFiltro.mockReturnValue(of({});


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TipoBeneficiarioService, 
        { provide: MessageService, useValue: messageServiceSpy },
        {provide: PrestadorExternoService, useValue: prestadorExternoServiceSpy },

      ]
    });
    service = TestBed.inject(TipoBeneficiarioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all beneficiaries', () => {
    const dummyBeneficiaries: DadoComboDTO[] = [
      {} as DadoComboDTO,
      {} as DadoComboDTO
    ];

    service.consultarTodosBeneficiarios().subscribe(beneficiaries => {
      expect(beneficiaries.length).toBe(2);
      expect(beneficiaries).toEqual(dummyBeneficiaries);
    });

    const req = httpMock.expectOne(`${baseUrl}/tipo-beneficiario/`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyBeneficiaries);
  });

  it('should fetch all absent beneficiaries by id', () => {
    const dummyBeneficiaries: DadoComboDTO[] = [
      {} as DadoComboDTO,
      {} as DadoComboDTO
    ];

    const id = 123;

    service.consultarTodosBeneficiariosAusentes(id).subscribe(beneficiaries => {
      expect(beneficiaries.length).toBe(2);
      expect(beneficiaries).toEqual(dummyBeneficiaries);
    });

    const req = httpMock.expectOne(`${baseUrl}/beneficiario-processo-ausente/${id}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyBeneficiaries);
  });
});
