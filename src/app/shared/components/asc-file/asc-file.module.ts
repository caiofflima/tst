import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AscFileSelectorComponent} from './asc-file-selector/asc-file-selector.component';
import {UploadFileService} from './services/upload-file.service';
import {FiltrarArquivoPorPipe} from './pipes/filtrar-arquivo-por.pipe';
import {CustomCardDocumentoComponent} from './custom-card-documento/custom-card-documento.component';
import {ProgressSpinnerModule} from "primeng/progressspinner";

@NgModule({
  imports: [
    CommonModule,
    ProgressSpinnerModule,
  ],
  declarations: [
    AscFileSelectorComponent,
    FiltrarArquivoPorPipe,
    CustomCardDocumentoComponent
  ],
  providers: [
    UploadFileService
  ],
  exports: [
    AscFileSelectorComponent,
    FiltrarArquivoPorPipe,
    CustomCardDocumentoComponent,
  ],
})
export class AscFileModule {
}
