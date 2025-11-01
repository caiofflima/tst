import { Component, Input, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '../../../../../app/shared/components/base.component';
import { MessageService } from '../../../../../app/shared/components/messages/message.service';

@Component({
  selector: 'asc-vis-dados-titular',
  templateUrl: './vis-dados-titular.component.html',
  styleUrls: ['./vis-dados-titular.component.scss']
})
export class AscVisDadosTitularComponent extends BaseComponent implements OnInit  {

  @Input('titular') titular: any;
  @Input('mostrarMeusProcessos') mostrarMeusProcessos: boolean;
  
  constructor(protected override messageService: MessageService, private router: Router){
      super( messageService );
  }
  
  public ngOnInit(): void{
      if(this.mostrarMeusProcessos == undefined){
          this.mostrarMeusProcessos = true;
      }
  }
  
  public chamarMeusProcessos():void {
      this.router.navigateByUrl( '/meus-dados/pedidos' );
  }
}
