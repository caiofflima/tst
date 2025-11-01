import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MotivoSolicitacaoService } from './motivo-solicitacao.service';
import { MessageService } from '../../components/messages/message.service';
import { MotivoSolicitacao } from '../../../../app/shared/models/comum/motivo-solicitacao';

describe('MotivoSolicitacaoService', () => {
  let service: MotivoSolicitacaoService;
  let httpMock: HttpTestingController;
  let messageService: MessageService;
  const baseUrl = '/siasc-api/api/motivos-solicitacao';
  const messageServiceSpy = jasmine.createSpyObj('MessageService',['getDescription']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MotivoSolicitacaoService, 
        { provide: MessageService, useValue: messageServiceSpy },
      ]
    });

    service = TestBed.inject(MotivoSolicitacaoService);
    httpMock = TestBed.inject(HttpTestingController);
    messageService = TestBed.inject(MessageService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch MotivoSolicitacao by id', () => {
    const dummyMotivoSolicitacao: MotivoSolicitacao = {} as MotivoSolicitacao;

    service.consultarPorId(1).subscribe(motivoSolicitacao => {
      expect(motivoSolicitacao).toEqual(dummyMotivoSolicitacao);
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyMotivoSolicitacao);
  });

  it('should fetch MotivoSolicitacao by tipo processo and id beneficiario', () => {
    const dummyMotivosSolicitacao: MotivoSolicitacao[] = [
      {} as MotivoSolicitacao,
      {} as MotivoSolicitacao
    ];

    service.consultarPorTipoProcesso(1, 1).subscribe(motivosSolicitacao => {
      expect(motivosSolicitacao.length).toBe(2);
      expect(motivosSolicitacao).toEqual(dummyMotivosSolicitacao);
    });

    const req = httpMock.expectOne(`${baseUrl}/tipo-processo/1/id-beneficiario/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyMotivosSolicitacao);
  });
});
