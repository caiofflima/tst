import { Observable } from 'rxjs';

export interface ComponenteUploadable {
    upload(formData: FormData): Observable<any>;
}
