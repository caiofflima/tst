import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FileUploadService } from './file-upload.service';
import { MessageService } from '../../components/messages/message.service';
import { HttpClient } from '@angular/common/http';
import * as constantes from '../../../../app/shared/constantes';

describe('FileUploadService', () => {
  let service: FileUploadService;
  let httpMock: HttpTestingController;
  const baseUrl = '/siasc-api/api/uploads';
  const messageServiceSpy = { getDescription: jest.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FileUploadService, 
        { provide: MessageService, useValue: messageServiceSpy }
      ]
    });

    service = TestBed.inject(FileUploadService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('realizarUpload', () => {
    it('should call http.post with correct URL and formData', () => {
      const formData = new FormData();
      const mockResponse = { success: true };

      service.realizarUpload(formData).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(baseUrl + '/');
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should call configurarFormDataComArquivos if files are provided', () => {
      const formData = new FormData();
      const files = [new File([''], 'filename')];
      jest.spyOn<any>(FileUploadService, 'configurarFormDataComArquivos');

      service.realizarUpload(formData, files).subscribe();

      const req = httpMock.expectOne(baseUrl + '/');
      expect(req.request.method).toBe('POST');
      req.flush({ success: true });

      expect(FileUploadService['configurarFormDataComArquivos']).toHaveBeenCalledWith(formData, files);
    });
  });

  
});
