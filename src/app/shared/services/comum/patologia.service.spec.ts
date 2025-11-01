import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PatologiaService } from './patologia.service';
import { Patologia } from '../../../../app/shared/models/entidades';
import { FiltroPatologia } from '../../../../app/shared/models/filtro/filtro-patologia';
import { MessageService } from '../../components/messages/message.service';

describe('PatologiaService', () => {
  let service: PatologiaService;
  let httpMock: HttpTestingController;
  const baseUrl = '/siasc-api/api/patologias';
  const messageServiceSpy = jasmine.createSpyObj('MessageService',['getDescription']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PatologiaService, 
        { provide: MessageService, useValue: messageServiceSpy },
      ]
    });
    service = TestBed.inject(PatologiaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all patologias', () => {
    const dummyPatologias: Patologia[] = [{ id: 1, nome: 'Patologia 1' }, { id: 2, nome: 'Patologia 2' }];

    service.consultarTodos().subscribe(patologias => {
      expect(patologias.length).toBe(2);
      expect(patologias).toEqual(dummyPatologias);
    });

    const req = httpMock.expectOne(`${baseUrl}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyPatologias);
  });

  it('should fetch patologias by filter', () => {
    const dummyPatologias: Patologia[] = [{ id: 1, nome: 'Patologia 1' }];
    const filtro = new FiltroPatologia();
    spyOn(filtro, 'montarQueryString').and.returnValue('nome=Patologia 1');

    service.consultarPorFiltro(filtro).subscribe(patologias => {
      expect(patologias.length).toBe(1);
      expect(patologias).toEqual(dummyPatologias);
    });

    const req = httpMock.expectOne(`${baseUrl}/?nome=Patologia 1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyPatologias);
  });

  it('should fetch all active patologias', () => {
    const dummyPatologias: Patologia[] = [{ id: 1, nome: 'Patologia 1' }];

    service.consultarTodosAtivos().subscribe(patologias => {
      expect(patologias.length).toBe(1);
      expect(patologias).toEqual(dummyPatologias);
    });

    const req = httpMock.expectOne(`${baseUrl}/consultarTodosAtivos`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyPatologias);
  });

  it('should fetch patologias by beneficiary code', () => {
    const dummyPatologias: Patologia[] = [{ id: 1, nome: 'Patologia 1' }];
    const codigoBeneficiario = 123;

    service.consultarTodasPatologiasEmInscriacaoDeProgramasPor(codigoBeneficiario).subscribe(patologias => {
      expect(patologias.length).toBe(1);
      expect(patologias).toEqual(dummyPatologias);
    });

    const req = httpMock.expectOne(`${baseUrl}/beneficiario/123/inscricao-programas`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyPatologias);
  });

  it('should fetch patologia by pedido id', () => {
    const dummyPatologias: Patologia[] = [{ id: 1, nome: 'Patologia 1' }];
    const idPedido = '123';

    service.consultarPatologiaPedido(idPedido).subscribe(patologias => {
      expect(patologias.length).toBe(1);
      expect(patologias).toEqual(dummyPatologias);
    });

    const req = httpMock.expectOne(`${baseUrl}/patologia-pedido/123`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyPatologias);
  });

  it('should fetch patologia by id', () => {
    const dummyPatologia: Patologia = { id: 1, nome: 'Patologia 1' };

    service.consultarPorId(1).subscribe(patologia => {
      expect(patologia).toEqual(dummyPatologia);
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyPatologia);
  });

  it('should fetch DTO patologia by id', () => {
    const dummyPatologia: Patologia = { id: 1, nome: 'Patologia 1' };

    service.consultarDTOPorId(1).subscribe(patologia => {
      expect(patologia).toEqual(dummyPatologia);
    });

    const req = httpMock.expectOne(`${baseUrl}/dto/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyPatologia);
  });

  it('should add a new patologia', () => {
    const newPatologia: Patologia = { id: 1, nome: 'Patologia 1' };

    service.incluir(newPatologia).subscribe(patologia => {
      expect(patologia).toEqual(newPatologia);
    });

    const req = httpMock.expectOne(`${baseUrl}`);
    expect(req.request.method).toBe('POST');
    req.flush(newPatologia);
  });

  it('should update an existing patologia', () => {
    const updatedPatologia: Patologia = { id: 1, nome: 'Updated Patologia' };

    service.alterar(updatedPatologia).subscribe(patologia => {
      expect(patologia).toEqual(updatedPatologia);
    });

    const req = httpMock.expectOne(`${baseUrl}`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedPatologia);
  });

  it('should delete a patologia by id', () => {
    service.excluir(1).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
