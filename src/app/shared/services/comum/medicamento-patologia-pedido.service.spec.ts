import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MedicamentoPatologiaPedidoService } from './medicamento-patologia-pedido.service';
import { MedicamentoPatologiaPedido } from '../../models/comum/medicamento-patologia-pedido';
import { MessageService } from '../../components/messages/message.service';

describe('MedicamentoPatologiaPedidoService', () => {
  let service: MedicamentoPatologiaPedidoService;
  let httpMock: HttpTestingController;
  const baseUrl = '/siasc-api/api/medicamentos-patologia-pedido';
  const messageServiceSpy = { getDescription: jest.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MedicamentoPatologiaPedidoService,
        { provide: MessageService, useValue: messageServiceSpy }
      ]
    });

    service = TestBed.inject(MedicamentoPatologiaPedidoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should include a MedicamentoPatologiaPedido', () => {
    const dummyMedicamentoPatologia: MedicamentoPatologiaPedido = { /* mock data */ };

    service.incluir(dummyMedicamentoPatologia).subscribe(response => {
      expect(response).toEqual(dummyMedicamentoPatologia);
    });

    const req = httpMock.expectOne(`${baseUrl}`);
    expect(req.request.method).toBe('POST');
    req.flush(dummyMedicamentoPatologia);
  });

  it('should delete a MedicamentoPatologiaPedido by id', () => {
    const id = 1;

    service.excluir(id).subscribe(response => {
      expect(response).toEqual({});
    });

    const req = httpMock.expectOne(`${baseUrl}/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should update a MedicamentoPatologiaPedido', () => {
    const dummyMedicamentoPatologia: MedicamentoPatologiaPedido = { /* mock data */ };

    service.atualizar(dummyMedicamentoPatologia).subscribe(response => {
      expect(response).toEqual(dummyMedicamentoPatologia);
    });

    const req = httpMock.expectOne(`${baseUrl}`);
    expect(req.request.method).toBe('PUT');
    req.flush(dummyMedicamentoPatologia);
  });

  it('should get MedicamentoPatologiaPedido by idPedido', () => {
    const idPedido = 1;
    const dummyResponse = [/* mock data */];

    service.consultarPorIdPedido(idPedido).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/pedido/${idPedido}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });
});
