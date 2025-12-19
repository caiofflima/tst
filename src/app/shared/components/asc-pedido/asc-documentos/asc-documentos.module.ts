import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AscDocumentoCardComponent} from "./documento-card/asc-documento-card.component";
import {AscFileModule} from "../../asc-file/asc-file.module";
import {AscModalVisualizarDocumentoComponent} from "./modal-visualizar-documento/asc-modal-visualizar-documento.component";
import {DialogModule} from "primeng/dialog";
import {MessageModule} from "primeng/message";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {ProgressBarModule} from "primeng/progressbar";
import {ComponentModule} from "../../../../../app/shared/components/component.module";
import {AscModalModule} from "../../asc-modal/asc-modal.module";
import {PrimeNGModule} from '../../../../../app/shared/primeng.module';
import {AscButtonsModule} from "../../../../../app/shared/components/asc-buttons/asc-buttons.module";
import {DocumentoComplementarCardComponent} from "./documento-complementar/asc-documento-complementar-card.component";
import {FormsModule} from "@angular/forms";
import {PipeModule} from "../../../pipes/pipe.module";
import {PdfViewerModule} from 'ng2-pdf-viewer';
import {DownloadViewerComponent} from "./documento-card/download-viewer.component";
import {DscDialogModule} from "sidsc-components/dsc-dialog";
import {DscProgressSpinnerComponent} from "sidsc-components/dsc-progress-spinner";


@NgModule({
  imports: [
    CommonModule,
    AscFileModule,
    MessageModule,
    OverlayPanelModule,
    ComponentModule,
    DialogModule,
    DialogModule,
    AscModalModule,
    ProgressBarModule,
    PrimeNGModule,
    AscButtonsModule,
    FormsModule,
    PipeModule,
    PdfViewerModule,
    DscDialogModule,
    DscProgressSpinnerComponent
  ],
  declarations: [
    AscDocumentoCardComponent,
    AscModalVisualizarDocumentoComponent,
    DocumentoComplementarCardComponent,
    DownloadViewerComponent
 
  ],
  exports: [
    AscDocumentoCardComponent,
    AscModalVisualizarDocumentoComponent,
    DocumentoComplementarCardComponent,
    DownloadViewerComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AscDocumentosModule {
}
