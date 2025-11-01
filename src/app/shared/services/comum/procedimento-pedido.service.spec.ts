import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProcedimentoPedidoService } from './procedimento-pedido.service';
import { MessageService } from '../../components/messages/message.service';
import { Router } from '@angular/router';
import { PedidoProcedimento } from '../../models/comum/pedido-procedimento';

describe('ProcedimentoPedidoService', () => {
  let service: ProcedimentoPedidoService;
  let httpMock: HttpTestingController;
  const baseUrl = '/siasc-api/api/procedimentos-pedido';
  const messageServiceSpy = jasmine.createSpyObj('MessageService',['getDescription']);
  const routerSpy = jasmine.createSpyObj('Router', ['navigate', 'url']);


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProcedimentoPedidoService,
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    service = TestBed.inject(ProcedimentoPedidoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call consultarPedidosProcedimentoPorPedido and return an Observable', () => {
    const dummyResponse = { data: 'test' };
    const idPedido = 1;

    service.consultarPedidosProcedimentoPorPedido(idPedido).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/pedido/${idPedido}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });

  it('should call consultarPedidosPorPedidoEProcedimento and return an Observable', () => {
    const dummyResponse = { data: 'test' };
    const idPedido = 1;
    const idProcedimento = 2;

    service.consultarPedidosPorPedidoEProcedimento(idPedido, idProcedimento).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/pedido/${idPedido}/procedimento/${idProcedimento}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });

  it('should call incluirOuAtualizarPedidoProcedimento and return an Observable', () => {
    const dummyResponse = { data: 'test' };
    const pedidoProcedimento: PedidoProcedimento = {} as PedidoProcedimento;

    service.incluirOuAtualizarPedidoProcedimento(pedidoProcedimento).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/`);
    expect(req.request.method).toBe('POST');
    req.flush(dummyResponse);
  });

  it('should call excluirPorId and return an Observable', () => {
    const dummyResponse = { data: 'test' };
    const idPedidoProcedimento = 1;

    service.excluirPorId(idPedidoProcedimento).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/${idPedidoProcedimento}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(dummyResponse);
  });

  it('should call excluirProcedimentosPedidoPorIdPedido and return an Observable', () => {
    const dummyResponse = { data: 'test' };
    const idPedido = 1;

    service.excluirProcedimentosPedidoPorIdPedido(idPedido).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/excluir-procedimentos/pedido/${idPedido}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(dummyResponse);
  });

  it('should set and get pedidoProcedimentosTabela', () => {
    const pedidoProcedimentos: PedidoProcedimento[] = [{} as PedidoProcedimento];
    service.setPedidoProcedimentoTabela(pedidoProcedimentos);
    expect(service.getPedidoProcedimentoTabela()).toEqual(pedidoProcedimentos);
  });

  it('should emit valorNotaFiscal', () => {
    spyOn(service.pedidoListenerValorNotaFiscal, 'emit');
    const valor = 'test';
    service.setValorNotaFiscal(valor);
    expect(service.pedidoListenerValorNotaFiscal.emit).toHaveBeenCalledWith(valor);
  });

  it('should return the current route', () => {
    routerSpy.url = 'test/url';
    expect(service.obterRotaAtual()).toBe('test/url');
  });
});
