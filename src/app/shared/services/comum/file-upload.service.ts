import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudHttpClientService} from '../../../arquitetura/shared/services/crud-http-client.service';
import * as constantes from '../../../../app/shared/constantes';
import {RetornoSIASC} from "../../models/dto/retorno-siasc";
import {Observable} from "rxjs";
import {MessageService} from "../../components/messages/message.service";

@Injectable()
export class FileUploadService extends CrudHttpClientService<any> {

    constructor(
        override readonly messageService: MessageService,
        protected override readonly http: HttpClient
    ) {
        super('uploads', http, messageService);
    }

    public realizarUpload(formData: FormData, files?: File[]): Observable<any> {
        const opts = this.options();
        if (files) {
            formData = FileUploadService.configurarFormDataComArquivos(formData, files);
        }
        return this.http.post(this.url + '/', formData, opts);
    }

    private static configurarFormDataComArquivos(formData: FormData, files): FormData {
        if (files) {
            if (files.length == 0) {
                throw new Error('É necessário uma lista de arquivos válida.');
            }
            constantes.configurarArquivosUpload(formData, files);
        }
        return formData;
    }

}
