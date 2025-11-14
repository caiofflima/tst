import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LocalidadeService } from './localidade.service';
import { MessageService } from '../../components/messages/message.service';
import { Municipio } from '../../models/entidades';

describe('LocalidadeService', () => {
  let service: LocalidadeService;
  let httpMock: HttpTestingController;
  const baseUrl = '/siasc-api/api/localidades';
  const messageServiceSpy = { getDescription: jest.fn() };
  const dummyMunicipios: Municipio[] = [
    {} as Municipio,
    {} as Municipio
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LocalidadeService, 
        { provide: MessageService, useValue: messageServiceSpy }
      ]
    });

    service = TestBed.inject(LocalidadeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch municipios by UF', () => {
    service.consultarMunicipiosPorSgUF('SP').subscribe(municipios => {
      expect(municipios.length).toBe(2);
      expect(municipios).toEqual(dummyMunicipios);
    });

    const req = httpMock.expectOne(`${baseUrl}/SP/municipios`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyMunicipios);
  });

  it('should fetch municipios by same UF and id', () => {
    service.consultarDadosComboMunicipiosMesmaUFPorIdMunicipio(1).subscribe(municipios => {
      expect(municipios.length).toBe(2);
      expect(municipios).toEqual(dummyMunicipios);
    });

    const req = httpMock.expectOne(`${baseUrl}/municipios-mesma-uf/municipio/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyMunicipios);
  });

  it('should fetch municipio by id', () => {
    const dummyMunicipio: Municipio = { } as Municipio;

    service.consultarMunicipioPorId(1).subscribe(municipio => {
      expect(municipio).toEqual(dummyMunicipio);
    });

    const req = httpMock.expectOne(`${baseUrl}/municipio/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyMunicipio);
  });

  it('should fetch municipios by estado id', () => {
    service.consultarMunicipiosPorUF(1).subscribe(municipios => {
      expect(municipios.length).toBe(2);
      expect(municipios).toEqual(dummyMunicipios);
    });

    const req = httpMock.expectOne(`${baseUrl}/ufs/1/municipios`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyMunicipios);
  });
});
