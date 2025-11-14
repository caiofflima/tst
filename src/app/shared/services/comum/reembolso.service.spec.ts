import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReembolsoService } from './reembolso.service';
import { MessageService } from '../../components/messages/message.service';
import { Pedido } from '../../../../app/shared/models/comum/pedido';
import { RetornoSIASC } from '../../models/dto/retorno-siasc';

describe('ReembolsoService', () => {
  let service: ReembolsoService;
  let httpMock: HttpTestingController;
  const baseUrl = '/siasc-api/api/pedido/reembolso';
  const messageServiceSpy = { getDescription: jest.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReembolsoService, 
        { provide: MessageService, useValue: messageServiceSpy },
      ]
    });

    service = TestBed.inject(ReembolsoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should include a new pedido and return RetornoSIASC', () => {
    const mockPedido: Pedido = {} as Pedido;
    const mockResponse: RetornoSIASC = {} as RetornoSIASC;

    service.incluirNovo(mockPedido).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(baseUrl + '/');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });
});
