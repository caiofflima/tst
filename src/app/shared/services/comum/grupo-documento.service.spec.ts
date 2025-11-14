import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GrupoDocumentoService } from './grupo-documento.service';
import { MessageService } from '../../components/messages/message.service';
import { GrupoDocumento } from '../../models/comum/grupo-documento';

describe('GrupoDocumentoService', () => {
  let service: GrupoDocumentoService;
  let httpMock: HttpTestingController;
  const baseUrl = '/siasc-api/api/grupo-documento';
  const messageServiceSpy = { getDescription: jest.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GrupoDocumentoService, 
        { provide: MessageService, useValue: messageServiceSpy }
      ]
    });

    service = TestBed.inject(GrupoDocumentoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all GrupoDocumento', () => {
    const dummyDocuments: GrupoDocumento[] = [
      {} as GrupoDocumento,
      {} as GrupoDocumento
    ];

    service.consultarTodos().subscribe(documents => {
      expect(documents.length).toBe(2);
      expect(documents).toEqual(dummyDocuments);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(dummyDocuments);
  });
});
