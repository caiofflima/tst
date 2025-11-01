import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { InscricaoDependenteService } from './inscricao-dependente.service';
import { MessageService } from '../../components/messages/message.service';
import { PedidoDependenteDTO } from '../../models/dto/pedido-dependente';

describe('InscricaoDependenteService', () => {
  let service: InscricaoDependenteService;
  let httpMock: HttpTestingController;
  const baseUrl = '/siasc-api/api/dependente';
  const messageServiceSpy = jasmine.createSpyObj('MessageService',['getDescription']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [InscricaoDependenteService,
        { provide: MessageService, useValue: messageServiceSpy}]
    });

    service = TestBed.inject(InscricaoDependenteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch PedidoDependenteDTO by pedido id', () => {
    const dummyPedido: PedidoDependenteDTO = {} as PedidoDependenteDTO;
    const idPedido = 1;

    service.findByPedido(idPedido).subscribe(pedido => {
      expect(pedido).toEqual(dummyPedido);
    });

    const req = httpMock.expectOne(`${baseUrl}/${idPedido}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyPedido);
  });

  it('should fetch dependente by pedido id', () => {
    const dummyPedido: PedidoDependenteDTO = {} as PedidoDependenteDTO;
    const idPedido = 1;

    service.findDependenteByPedido(idPedido).subscribe(pedido => {
      expect(pedido).toEqual(dummyPedido);
    });

    const req = httpMock.expectOne(`${baseUrl}/findDependenteByPedido/${idPedido}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyPedido);
  });

  it('should save formData', () => {
    const formData = new FormData();
    const dummyResponse = { /* mock response */ };

    service.salvar(formData).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}`);
    expect(req.request.method).toBe('POST');
    req.flush(dummyResponse);
  });

  it('should cancel formData', () => {
    const formData = new FormData();
    const dummyResponse = { /* mock response */ };

    service.cancelar(formData).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/cancelar`);
    expect(req.request.method).toBe('POST');
    req.flush(dummyResponse);
  });

  it('should renew formData', () => {
    const formData = new FormData();
    const dummyResponse = { /* mock response */ };

    service.renovar(formData).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/renovar`);
    expect(req.request.method).toBe('POST');
    req.flush(dummyResponse);
  });
});
