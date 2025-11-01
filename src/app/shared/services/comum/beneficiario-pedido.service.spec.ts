import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BeneficiarioPedidoService } from './beneficiario-pedido.service';
import { MessageService } from '../../components/messages/message.service';
import { BeneficiarioPedido } from 'app/shared/models/comum/beneficiario-pedido';

describe('BeneficiarioPedidoService', () => {
  let service: BeneficiarioPedidoService;
  let httpMock: HttpTestingController;
  let messageService: MessageService;
  const baseUrl = '/siasc-api/api/beneficiario-pedido';
  const messageServiceSpy = jasmine.createSpyObj('MessageService',['getDescription']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        BeneficiarioPedidoService,
        { provide: MessageService, useValue: messageServiceSpy },
      ]
    });

    service = TestBed.inject(BeneficiarioPedidoService);
    httpMock = TestBed.inject(HttpTestingController);
    messageService = TestBed.inject(MessageService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call consultarBeneficiarioPedido and return a BeneficiarioPedido', () => {
    const mockBeneficiarioPedido: BeneficiarioPedido = { id: 1, idTipoProcesso: 1, idTipoBeneficiario: 2 };
    const responseBeneficiarioPedido: BeneficiarioPedido = { id: 1, idTipoProcesso: 1, idTipoBeneficiario: 2 };

    service.consultarBeneficiarioPedido(mockBeneficiarioPedido).subscribe((res) => {
      expect(res).toEqual(responseBeneficiarioPedido);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('PATCH');
    req.flush(responseBeneficiarioPedido);
  });

  it('should call consultarPorFiltro and return an array of BeneficiarioPedido', () => {
    const mockDto: BeneficiarioPedido = { id: null, idsTipoProcesso: [1, 2], somenteAtivos: true, tiposBeneficiario: [3, 4] };
    const responseBeneficiarioPedidos: BeneficiarioPedido[] = [
      { id: 1, idTipoProcesso: 1, idTipoBeneficiario: 2 },
      { id: 2, idTipoProcesso: 3, idTipoBeneficiario: 4 }
    ];

    service.consultarPorFiltro(mockDto).subscribe((res) => {
      expect(res).toEqual(responseBeneficiarioPedidos);
    });

    const req = httpMock.expectOne((request) => request.url === baseUrl && request.params.has('idsTipoProcesso') && request.params.has('somenteAtivos') && request.params.has('tiposBeneficiario'));
    expect(req.request.method).toBe('GET');
    req.flush(responseBeneficiarioPedidos);
  });

  it('should call remover and return the response', () => {
    const mockBeneficiarioPedido = { id: 1 };
    const response = { success: true };

    service.remover(mockBeneficiarioPedido).subscribe((res) => {
      expect(res).toEqual(response);
    });

    const req = httpMock.expectOne(`${baseUrl}/remove`);
    expect(req.request.method).toBe('PATCH');
    req.flush(response);
  });

  it('should return the correct base URL', () => {
    expect(service.getBaseURL()).toBe('/manutencao/parametros/tipobeneficiario-tipopedido');
  });

  it('should return the correct title', () => {
    expect(service.getTitulo()).toBe('Tipo de Beneficiário por Tipo de Pedido');
  });
});
