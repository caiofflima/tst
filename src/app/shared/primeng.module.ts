import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {CalendarModule} from 'primeng/calendar';
import {ChartModule} from 'primeng/chart';
import {CheckboxModule} from 'primeng/checkbox';
import {TableModule} from 'primeng/table';
import {DialogModule} from 'primeng/dialog';
import {DropdownModule} from 'primeng/dropdown';
import {EditorModule} from 'primeng/editor';
import {FieldsetModule} from 'primeng/fieldset';
import {FileUploadModule} from 'primeng/fileupload';
import {InputMaskModule} from 'primeng/inputmask';
import {MultiSelectModule} from 'primeng/multiselect';
import {PanelMenuModule} from 'primeng/panelmenu';
import {ProgressBarModule} from 'primeng/progressbar';
import {SharedModule} from 'primeng/api';
import {SidebarModule} from 'primeng/sidebar';
import {TabViewModule} from 'primeng/tabview';
import {RadioButtonModule} from 'primeng/radiobutton';
import {AccordionModule} from 'primeng/accordion';


@NgModule( {
    declarations: [],
    imports: [
        PanelMenuModule,
        SidebarModule,
        DropdownModule,
        TabViewModule,
        CheckboxModule,
        ProgressBarModule,
        CalendarModule,
        MultiSelectModule,
        AutoCompleteModule,
        FileUploadModule,
        EditorModule,
        TableModule,
        SharedModule,
        InputMaskModule,
        DialogModule,
        FieldsetModule,
        ChartModule,
        RadioButtonModule,
        AccordionModule
    ],
    exports: [
        PanelMenuModule,
        SidebarModule,
        DropdownModule,
        TabViewModule,
        CheckboxModule,
        ProgressBarModule,
        CalendarModule,
        MultiSelectModule,
        AutoCompleteModule,
        FileUploadModule,
        EditorModule,
        TableModule,
        SharedModule,
        InputMaskModule,
        DialogModule,
        FieldsetModule,
        ChartModule,
        RadioButtonModule,
        AccordionModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
} )
export class PrimeNGModule {

}