import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EmailService } from './email.service';
import { MessageService } from '../../components/messages/message.service';
import { Email } from '../../../../app/shared/models/comum/email';
import { FiltroConsultaEmail } from '../../../../app/shared/models/filtro/filtro-consulta-email';
import { Pageable } from "../../components/pageable.model";

describe('EmailService', () => {
  let service: EmailService;
  let httpMock: HttpTestingController;
  const baseUrl = '/siasc-api/api/emails';
  const messageServiceSpy = { getDescription: jest.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EmailService, 
        { provide: MessageService, useValue: messageServiceSpy }
      ]
    });

    service = TestBed.inject(EmailService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call consultar with correct parameters', () => {
    const filtro: FiltroConsultaEmail = {} as FiltroConsultaEmail;
    const limit = 10;
    const offset = 1;

    service.consultar(filtro, limit, offset).subscribe();

    const req = httpMock.expectOne((request) => 
      request.url === `${baseUrl}/consultar` &&
      request.method === 'POST' &&
      request.params.get('limit') === limit.toString() &&
      request.params.get('offset') === offset.toString()
    );

    expect(req.request.body).toEqual(filtro);
    req.flush({});
  });

  it('should call consultarPorId with correct URL', () => {
    const idEmail = 1;

    service.consultarPorId(idEmail).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/${idEmail}`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should convert single value to array', () => {
    const value = 'singleValue';
    const result = service.converterParaArray(value);
    expect(result).toEqual([value]);
  });

  it('should not convert array value', () => {
    const value = ['arrayValue'];
    const result = service.converterParaArray(value);
    expect(result).toEqual(value);
  });

  it('should convert null or undefined to array', () => {
    const nullValue = null;
    const undefinedValue = undefined;
    expect(service.converterParaArray(nullValue)).toEqual(nullValue);
    expect(service.converterParaArray(undefinedValue)).toEqual(undefinedValue);
  });

  it('should convert filtro variables to array', () => {
    const filtro: FiltroConsultaEmail = {} as FiltroConsultaEmail;
    service.converterVariaveisParaArray(filtro);
    expect(filtro.situacoesProcesso).toBeUndefined();
    expect(filtro.tiposProcesso).toBeUndefined();
    expect(filtro.tiposBeneficiario).toBeUndefined();
  });
});
