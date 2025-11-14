import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CategoriaBeneficiarioService } from './categoria-beneficiario.service';
import { MessageService } from '../../components/messages/message.service';

describe('CategoriaBeneficiarioService', () => {
  let service: CategoriaBeneficiarioService;
  let httpMock: HttpTestingController;
  const baseUrl = '/siasc-api/api/categorias-beneficiario';
  const messageServiceSpy = { getDescription: jest.fn() };

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CategoriaBeneficiarioService,
        { provide: MessageService, useValue: messageServiceSpy },
      ]
    });

    service = TestBed.inject(CategoriaBeneficiarioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call the correct URL when fetching data', () => {
    const dummyData = [{ id: 1, name: 'Test' }];
    service.get().subscribe(data => {
      expect(data).toEqual(dummyData);
    });

    const req = httpMock.expectOne(`${baseUrl}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyData);
  });

  it('should handle error response', () => {
    const errorMessage = `Http failure response for ${baseUrl}: 404 Not Found`;

    service.get().subscribe(
      () => fail('expected an error, not data'),
      error => expect(error.message).toContain(errorMessage)
    );

    const req = httpMock.expectOne(`${baseUrl}`);
    req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
  });
});
