import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { HttpClientService } from './app/arquitetura/shared/services/http-client.service';
import { environment } from './environments/environment';
import {Storage} from './app/arquitetura/shared/storage/storage';
import { SessaoService } from './app/shared/services/services';


if (environment.server) {
  enableProdMode();
}

const NOME_SISTEMA: string = 'SIASC';
HttpClientService.setNomeSistema(NOME_SISTEMA);
Storage.setNomeSistema(NOME_SISTEMA);

SessaoService.init().then((result: any) => {
  //console.log("🚀 ~ SessaoService.init ~ result:", result)
  if (result && result.code != undefined) {
      switch (result.code) {
          case 0: { // SUCESSO
              platformBrowserDynamic().bootstrapModule(AppModule);
              break;
          }
          case 1: { // ERRO na chamada de Consulta das Configurações de Segurança no Back-end

            alert('[ERRO01] Ocorreu um erro ao invocar o módulo servidor (back-end) do sistema.');
              console.error('Ocorreu algum erro ao Consultar as Configurações de Segurança do back-end.');
              console.error('Em ambiente de desenvolvimento, no browser Chrome, eventualmente é ' +
                  'necessário confirmar a autenticidade do certificado local de desenvolvimento ' +
                  'para o browser liberar o acesso à url. Faça isso numa aba a parte, invocando ' +
                  'a URL que gerou o erro.');
              break;
          }
          case 2: { // ERRO na chamada de Integração com o AIM Keycloak

            alert('[ERRO02] Ocorreu um erro ao invocar o módulo servidor (back-end) do sistema.');

              break;
          }
          case 3: { // ERRO na chamada de Consulta do Usuário Logado no Back-end
              console.error('Ocorreu algum erro ao Consultar os dados do Usuário Logado do back-end.');
              if (result.error) {
                  alert(result.error);
              } else {
                  alert('[ERRO03] Ocorreu um erro ao invocar o módulo servidor (back-end) do sistema.');
              }
              break;
          }
      }
  }
}).catch((e) => console.error(e + ' - Ocorreu algum erro ao iniciar a aplicação.'));
