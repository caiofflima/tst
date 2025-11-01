import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EstadoCivilService } from './estado-civil.service';
import { MessageService } from '../../components/messages/message.service';
import { EstadoCivil } from '../../../../app/shared/models/comum/estado-civil';

describe('EstadoCivilService', () => {
  let service: EstadoCivilService;
  let httpMock: HttpTestingController;
  const baseUrl = '/siasc-api/api/estado-civil';
  const messageServiceSpy = jasmine.createSpyObj('MessageService',['getDescription']);

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        EstadoCivilService,
        { provide: MessageService, useValue: messageServiceSpy }
      ]
    });

    service = TestBed.inject(EstadoCivilService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all EstadoCivil', () => {
    const dummyEstadoCivils: EstadoCivil[] = [{} as EstadoCivil, {} as EstadoCivil];

    service.consultarTodos().subscribe(estadoCivils => {
      expect(estadoCivils.length).toBe(2);
      expect(estadoCivils).toEqual(dummyEstadoCivils);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(dummyEstadoCivils);
  });

  it('should handle error when fetching EstadoCivil', () => {
    const errorMessage = `Http failure response for ${baseUrl}: 500 Server Error`;

    service.consultarTodos().subscribe(
      () => fail('expected an error, not EstadoCivil'),
      error => expect(error.message).toContain(errorMessage)
    );

    const req = httpMock.expectOne(baseUrl);
    req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
  });
});
