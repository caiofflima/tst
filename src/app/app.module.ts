import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MessageResourceImpl } from './app.message';
import { AuthGuard } from './arquitetura/shared/guards/security/auth.guard';
import { DadosUsuarioGuard } from './arquitetura/shared/guards/security/dados-usuario.guard';
import { RequestInterceptor } from './arquitetura/shared/interceptors/request.interceptor';
import { KeycloakService } from './arquitetura/shared/services/seguranca/keycloak.service';
import { ServiceModule } from './arquitetura/shared/services/service.module';
import { TemplatesModule } from './arquitetura/shared/templates/templates.module';
import { MessageResourceProvider } from './shared/components/messages/message-resource-provider';
import { MessageModule } from './shared/components/messages/message.module';
import { ValidationResourceProvider } from './shared/components/validation/validation-resource-provider';
import { PipeModule } from './shared/pipes/pipe.module';
import { PrimeNGModule } from './shared/primeng.module';
import { Data } from './shared/providers/data';
import { AppServiceModule } from './shared/services/app-service.module';
import {ModalModule} from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ValidationModule } from './shared/components/validation/validation.module';
import { LoadingModule } from './shared/components/loading/loading.module';
import { PaginationModule } from './shared/components/pagination/pagination.module';
// import { PdfViewerModule } from 'ng2-pdf-viewer';
import localePt from '@angular/common/locales/pt';
import {registerLocaleData} from '@angular/common';
import { AscDocumentosModule } from "./shared/components/asc-pedido/asc-documentos/asc-documentos.module";
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { DscCaixaModule } from './shared/dsc-caixa/dsc-caixa.module';


registerLocaleData(localePt,'pt')

@NgModule({
  declarations: [
      AppComponent
  ],
  imports: [
      HttpClientModule,
      BrowserModule,
      BrowserAnimationsModule,
      ModalModule.forRoot(),
      PopoverModule.forRoot(),
      ServiceModule.forRoot(),
      AppServiceModule.forRoot(),
      MessageModule.forRoot(),
      ValidationModule,
      LoadingModule.forRoot(),
      PaginationModule.forRoot(),
      PipeModule.forRoot(),
      TemplatesModule,
      AppRoutingModule,
      PrimeNGModule,
      NgxMaskDirective, NgxMaskPipe,
    //   PdfViewerModule,
    AscDocumentosModule,
    DscCaixaModule
  ],
  bootstrap: [AppComponent],
  providers: [
      {
          provide: MessageResourceProvider,
          useValue: MessageResourceImpl,
      },
      {
          provide: ValidationResourceProvider,
          useValue: MessageResourceImpl,
      },
      {
          provide: HTTP_INTERCEPTORS,
          useClass: RequestInterceptor,
          multi: true,
      },
      {
          provide: LOCALE_ID,
          useValue: 'pt'
      },
      KeycloakService,
      AuthGuard,
      DadosUsuarioGuard,
      Data
  ],
  schemas: [
      CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule { }
