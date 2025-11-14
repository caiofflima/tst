import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IntegracaoCorreiosService } from './integracao-correios.service';
import { MessageService } from '../../components/messages/message.service';
import { EnderecoCorreios } from '../../../../app/shared/models/comum/endereco-correios';
import { Localidade } from 'app/shared/models/localidate';

describe('IntegracaoCorreiosService', () => {
  let service: IntegracaoCorreiosService;
  let httpMock: HttpTestingController;
  const baseUrl = '/siasc-api/api/correios';
  const messageServiceSpy = { getDescription: jest.fn() };

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        IntegracaoCorreiosService,
        { provide: MessageService, useValue: messageServiceSpy }
      ]
    });

    service = TestBed.inject(IntegracaoCorreiosService);
    httpMock = TestBed.inject(HttpTestingController);

  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch endereco by CEP', () => {
    const dummyEndereco: EnderecoCorreios = {} as EnderecoCorreios;

    service.getEnderecoByCEP('12345678').subscribe(endereco => {
      expect(endereco).toEqual(dummyEndereco);
    });

    const req = httpMock.expectOne(`${baseUrl}/cep/12345678`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyEndereco);
  });
});
