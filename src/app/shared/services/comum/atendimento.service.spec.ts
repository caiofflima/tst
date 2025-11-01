import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AtendimentoService } from './atendimento.service';
import { MessageService } from '../../components/messages/message.service';
import { HttpClient } from '@angular/common/http';
import { Atendimento } from '../../models/comum/atendimento';

describe('AtendimentoService', () => {
  let service: AtendimentoService;
  let httpMock: HttpTestingController;
  const messageServiceSpy = jasmine.createSpyObj('MessageService',['getDescription']);
  const baseUrl = '/siasc-api/api/atendimentos';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AtendimentoService, 
        { provide: MessageService, useValue: messageServiceSpy },
      ]
    });

    service = TestBed.inject(AtendimentoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initiate atendimento', () => {
    const mockAtendimento: Atendimento = { matricula: '12345' } as Atendimento;

    service.iniciar('12345').subscribe(atendimento => {
      expect(atendimento).toEqual(mockAtendimento);
      expect(AtendimentoService.atendimento).toEqual(mockAtendimento);
    });

    const req = httpMock.expectOne(`${baseUrl}/iniciar/12345`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAtendimento);
  });

  it('should finalize atendimento', () => {
    service.finalizar().subscribe(atendimento => {
      expect(atendimento).toBeNull();
      expect(AtendimentoService.atendimento).toBeNull();
    });

    const req = httpMock.expectOne(`${baseUrl}/finalizar`);
    expect(req.request.method).toBe('GET');
    req.flush(null);
  });

  it('should return matricula without hyphen', () => {
    AtendimentoService.atendimento = { matricula: '123-45' } as Atendimento;
    expect(AtendimentoService.matricula).toBe('12345');
  });

  it('should return null if no atendimento', () => {
    AtendimentoService.atendimento = null;
    expect(AtendimentoService.matricula).toBeNull();
  });
});
