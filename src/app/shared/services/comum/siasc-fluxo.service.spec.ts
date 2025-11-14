import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SIASCFluxoService } from './siasc-fluxo.service';
import { MessageService } from '../../components/messages/message.service';
import { PermissoesSituacaoProcesso } from '../../models/fluxo/permissoes-situacao-processo';
import { Router } from '@angular/router';

describe('SIASCFluxoService', () => {
  let service: SIASCFluxoService;
  let httpMock: HttpTestingController;
  let router: Router;
  const baseUrl = '/siasc-api/api/fluxos';
  const messageServiceSpy = { getDescription: jest.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [SIASCFluxoService, 
        { provide: MessageService, useValue: messageServiceSpy }
      ]
    });

    service = TestBed.inject(SIASCFluxoService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call consultarPermissoesFluxoPorPedido and return an Observable<PermissoesSituacaoProcesso>', () => {
    const dummyPermissoes: PermissoesSituacaoProcesso = {} as PermissoesSituacaoProcesso;
    const idPedido = 1;
    const tipo = 'someTipo';
    const url = `${baseUrl}/pedido/${idPedido}/${tipo}/permissoes`;

    spyOnProperty(router, 'url', 'get').mockReturnValue(`${baseUrl}/pedido/${idPedido}/${tipo}`);

    service.consultarPermissoesFluxoPorPedido(idPedido).subscribe(permissoes => {
      expect(permissoes).toEqual(dummyPermissoes);
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(dummyPermissoes);
  });
});