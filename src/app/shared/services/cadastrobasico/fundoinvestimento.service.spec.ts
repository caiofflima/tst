import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MessageService } from '../../components/messages/message.service';
import { FundoInvestimento } from '../../../../app/shared/models/fundoinvestimento';
import { FundoInvestimentoService } from './fundoinvestimento.service';

describe('FundoInvestimentoService', () => {
  let service: FundoInvestimentoService;
  let httpMock: HttpTestingController;
  const baseUrl = '/siasc-api/api/cadastrobasico/fundoinvestimento';
  const messageServiceSpy = jasmine.createSpyObj('MessageService',['getDescription']);
  const dummyFundos: FundoInvestimento[] = [
    {} as FundoInvestimento,
    {} as FundoInvestimento
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FundoInvestimentoService, 
        { provide: MessageService, useValue: messageServiceSpy }
      ]
    });

    service = TestBed.inject(FundoInvestimentoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should list all fundos de investimento', () => {
      service.listarTodos().subscribe(fundos => {
      expect(fundos.length).toBe(2);
      expect(fundos).toEqual(dummyFundos);
    });

    const req = httpMock.expectOne(`${baseUrl}/listar-todos`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyFundos);
  });

  it('should filter fundos de investimento', () => {
    const filter: FundoInvestimento = {} as FundoInvestimento;

    service.filtrar(filter).subscribe(fundos => {
      expect(fundos.length).toBe(2);
      expect(fundos).toEqual(dummyFundos);
    });

    const req = httpMock.expectOne(`${baseUrl}/filtrar`);
    expect(req.request.method).toBe('POST');
    req.flush(dummyFundos);
  });

  it('should include a new fundo de investimento', () => {
    const newFundo: FundoInvestimento = {} as FundoInvestimento;

    service.incluir(newFundo).subscribe(response => {
      expect(response).toBeTrue();
    });

    const req = httpMock.expectOne(`${baseUrl}/incluir`);
    expect(req.request.method).toBe('POST');
    req.flush(true);
  });

  it('should get fundo de investimento by id', () => {
    const dummyFundo: FundoInvestimento = {} as FundoInvestimento;

    service.consultaPorId(1).subscribe(fundo => {
      expect(fundo).toEqual(dummyFundo);
    });

    const req = httpMock.expectOne(`${baseUrl}/consulta-por-id/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyFundo);
  });

  it('should update a fundo de investimento', () => {
    const updatedFundo: FundoInvestimento = {} as FundoInvestimento;

    service.atualizar(updatedFundo).subscribe(response => {
      expect(response).toBeTrue();
    });

    const req = httpMock.expectOne(`${baseUrl}/atualizar`);
    expect(req.request.method).toBe('PUT');
    req.flush(true);
  });

  it('should remove a fundo de investimento', () => {
    const dummyFundo: FundoInvestimento = {} as FundoInvestimento;
    dummyFundo.id = 1;

    service.remover(dummyFundo).subscribe(response => {
      expect(response).toBeTrue();
    });

    const req = httpMock.expectOne(`${baseUrl}/remover/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(true);
  });
});
