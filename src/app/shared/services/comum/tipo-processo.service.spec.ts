import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TipoProcessoService } from './tipo-processo.service';
import { MessageService } from '../../components/messages/message.service';
import { TipoProcesso } from '../../../../app/shared/models/comum/tipo-processo';
import { PrestadorExternoService } from './prestador-externo.service';
import { of } from 'rxjs';

describe('TipoProcessoService', () => {
  let service: TipoProcessoService;
  let httpMock: HttpTestingController;
  const baseUrl = '/siasc-api/api/tipos-processo';
  const messageServiceSpy = { getDescription: jest.fn() };
  const prestadorExternoServiceSpy = { get: jest.fn(), consultarUsuarioExternoPorFiltro: jest.fn() };
  prestadorExternoServiceSpy.consultarUsuarioExternoPorFiltro.mockReturnValue(of({});

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TipoProcessoService, 
        { provide: MessageService, useValue: messageServiceSpy },
        {provide: PrestadorExternoService, useValue: prestadorExternoServiceSpy },

      ]
    });
    service = TestBed.inject(TipoProcessoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all tipos processo', () => {
    const dummyTiposProcesso: TipoProcesso[] = [
      { id: 1, nome: 'Processo 1' },
      { id: 2, nome: 'Processo 2' }
    ];

    service.consultarTodos().subscribe(tiposProcesso => {
      expect(tiposProcesso.length).toBe(2);
      expect(tiposProcesso).toEqual(dummyTiposProcesso);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(dummyTiposProcesso);
  });

  it('should fetch tipos processo autorizacao previa', () => {
    const dummyTiposProcesso: TipoProcesso[] = [
      { id: 1, nome: 'Processo 1' },
      { id: 2, nome: 'Processo 2' }
    ];

    service.consultarTiposProcessoAutorizacaoPrevia().subscribe(tiposProcesso => {
      expect(tiposProcesso.length).toBe(2);
      expect(tiposProcesso).toEqual(dummyTiposProcesso);
    });

    const req = httpMock.expectOne(`${baseUrl}/autorizacao-previa`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyTiposProcesso);
  });

  it('should fetch tipos processo autorizacao previa novo pedido and filter out id 20', () => {
    const dummyTiposProcesso: TipoProcesso[] = [
      { id: 1, nome: 'Processo 1' },
      { id: 20, nome: 'Processo 20' },
      { id: 2, nome: 'Processo 2' }
    ];

    service.consultarTiposProcessoAutorizacaoPreviaNovoPedido().subscribe(tiposProcesso => {
      expect(tiposProcesso.length).toBe(2);
      expect(tiposProcesso).toEqual([
        { id: 1, nome: 'Processo 1' },
        { id: 2, nome: 'Processo 2' }
      ]);
    });

    const req = httpMock.expectOne(`${baseUrl}/autorizacao-previa`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyTiposProcesso);
  });

  it('should fetch tipos processo reembolso', () => {
    const dummyTiposProcesso: TipoProcesso[] = [
      { id: 1, nome: 'Processo 1' },
      { id: 2, nome: 'Processo 2' }
    ];

    service.consultarTiposProcessoReembolso().subscribe(tiposProcesso => {
      expect(tiposProcesso.length).toBe(2);
      expect(tiposProcesso).toEqual(dummyTiposProcesso);
    });

    const req = httpMock.expectOne(`${baseUrl}/reembolso`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyTiposProcesso);
  });

  it('should fetch tipos processo cancelamento', () => {
    const dummyTiposProcesso: TipoProcesso[] = [
      { id: 1, nome: 'Processo 1' },
      { id: 2, nome: 'Processo 2' }
    ];

    service.consultarTiposProcessoCancelamento().subscribe(tiposProcesso => {
      expect(tiposProcesso.length).toBe(2);
      expect(tiposProcesso).toEqual(dummyTiposProcesso);
    });

    const req = httpMock.expectOne(`${baseUrl}/cancelamento`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyTiposProcesso);
  });

  it('should fetch tipos processo inscricao programas', () => {
    const dummyTiposProcesso: TipoProcesso[] = [
      { id: 1, nome: 'Processo 1' },
      { id: 2, nome: 'Processo 2' }
    ];

    service.consultarTiposProcessoInscricaoProgramas().subscribe(tiposProcesso => {
      expect(tiposProcesso.length).toBe(2);
      expect(tiposProcesso).toEqual(dummyTiposProcesso);
    });

    const req = httpMock.expectOne(`${baseUrl}/medicamento-uso-domiciliar`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyTiposProcesso);
  });
});
