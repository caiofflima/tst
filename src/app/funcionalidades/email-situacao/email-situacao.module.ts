import {NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TemplatesModule} from 'app/arquitetura/shared/templates/templates.module';
import {DirectivesModule} from 'app/arquitetura/shared/directives/directives.module';
import {TabsModule} from 'ngx-bootstrap/tabs';
import { NgxMaskModule } from 'ngx-mask';
import {NgxPaginationModule} from 'ngx-pagination';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {CalendarModule} from 'primeng/calendar';
import {CheckboxModule} from 'primeng/checkbox';
import {TableModule} from 'primeng/table';
import {DialogModule} from 'primeng/dialog';
import {DropdownModule} from 'primeng/dropdown';
import {EditorModule} from 'primeng/editor';
import {FileUploadModule} from 'primeng/fileupload';
import {InputMaskModule} from 'primeng/inputmask';
import {MultiSelectModule} from 'primeng/multiselect';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {ProgressBarModule} from 'primeng/progressbar';
import {TabViewModule} from 'primeng/tabview';
import {RadioButtonModule} from 'primeng/radiobutton';
import {EmailSituacaoHomeComponent} from './email-situacao-home/email-situacao-home.component';
import {EmailSituacaoRoutingModule} from './email-situacao.routing.module';
import {EmailSituacaoListarComponent} from './email-situacao-listar/email-situacao-listar.component';
import {EmailSituacaoFormComponent} from './email-situacao-form/email-situacao-form.component';
import {AscMultiSelectModule} from 'app/shared/components/multiselect/asc-multiselect.module';
import {PipeModule} from 'app/shared/pipes/pipe.module';
import {AscMessageErrorModule} from 'app/shared/components/message-error/asc-message-error.module';
import {TextoAjudaEmailComponent} from './texto-ajuda-email/texto-ajuda-email.component';
import {ComponentModule} from "../../shared/components/component.module";
import {AscButtonsModule} from "../../shared/components/asc-buttons/asc-buttons.module";


@NgModule({
    imports: [
        CommonModule,
        EmailSituacaoRoutingModule,
        DirectivesModule.forRoot(),
        FormsModule,
        DropdownModule,
        TabViewModule,
        TableModule,
        DialogModule,
        CheckboxModule,
        InputMaskModule,
        FileUploadModule,
        ProgressBarModule,
        NgxPaginationModule,
        MultiSelectModule,
        AutoCompleteModule,
        CalendarModule,
        EditorModule,
        ReactiveFormsModule,
        RouterModule,
        TabsModule.forRoot(),
        TemplatesModule,
        NgxMaskModule,
        AscMultiSelectModule,
        AscMessageErrorModule,
        PipeModule,
        OverlayPanelModule,
        ComponentModule,
        AscButtonsModule,
        RadioButtonModule
    ],
    declarations: [
        EmailSituacaoHomeComponent,
        EmailSituacaoListarComponent,
        EmailSituacaoFormComponent,
        TextoAjudaEmailComponent
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
      ]
})
export class EmailSituacaoModule {
}
