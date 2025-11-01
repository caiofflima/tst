import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { SessaoService } from './shared/services/services';
import {CalendarLocalePt} from "../app/shared/util/calendar-locale-pt";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'siasc_angular_15';
  constructor(private sessaoService: SessaoService,private primeNGConfig:PrimeNGConfig) {
    this.sessaoService.inicializarSessao();
  }

  ngOnInit():void{
    let pt = new CalendarLocalePt();
    this.primeNGConfig.setTranslation(pt)

  }

  isJanelaDownload():boolean{
    let url = window.location.href;
    if(url.includes("downloadArquivo")){
      return true;
    }else{
      return false;
    }
  }
}
