
import { Component,  OnInit } from '@angular/core';
import { BeneficiarioService, MessageService, SessaoService } from 'app/shared/services/services';
import { ActivatedRoute, Router } from '@angular/router';
import { DetalheBeneficiarioDTO } from 'app/shared/models/comum/detalhe-beneficiario-dto.model';
import { Location } from '@angular/common';
@Component({
    selector: 'app-dependente-detail',
    templateUrl: './dependente-detail.component.html',
    styleUrls: ['./dependente-detail.component.scss']
})
export class DependenteDetailComponent implements OnInit{

   beneficiario: DetalheBeneficiarioDTO = null;
   idBeneficiario: number = null;

    constructor(
        private messageService: MessageService,
        private beneficiarioService: BeneficiarioService,
        private route: ActivatedRoute,
        private router: Router,
        private location: Location) {
    }

    get matricula(): string {
        return SessaoService.getMatriculaFuncional();
    }
    
    ngOnInit() {

      this.idBeneficiario = this.route.snapshot.params.idBeneficiario;
      console.log('idBeneficiario: ' + this.idBeneficiario)
      this.getDadosBeneficiarioCartaoPlano(this.idBeneficiario);
    }

    redirectAtualizarDependentePage() {
      this.router.navigate([
        `dependente/alterar-dependente/${this.idBeneficiario}`,
      ]);
    }

    redirectRenovarDependentePage() {
      this.router.navigate([
        `renovar-dependente/renovar/${this.idBeneficiario}`,
      ]);
    }

    redirectCancelarDependentePage() {
      this.router.navigate([
        `cancelar-dependente/cancelar/${this.idBeneficiario}`,
      ]);
    }

    redirectCartaoPage() {
      this.router.navigate([`meus-dados/cartoes/detail/${this.idBeneficiario}`]);
    }

    getDadosBeneficiarioCartaoPlano(idBeneficiario: number) {
      this.beneficiarioService.getDadosBeneficiarioCartaoPlano(idBeneficiario).subscribe( res => {
        if (res) {
          this.beneficiario = res;
        }
      },
      (err) => {
        this.messageService.addMsgDanger(err.error);
      }
    );
    }
   
    public backButton(): void {
      this.location.back();
    }

    isCartaoExpirado(dataExpiracaoCartao: Date | any) {
      if(!dataExpiracaoCartao) {
        return false;
      }
  
      if (!(dataExpiracaoCartao instanceof Date)) {
        dataExpiracaoCartao = this.parseDateString(dataExpiracaoCartao);
      }
      
  }

  parseDateString(dateString) {
    const [year, month, day] = dateString.split('-').map(Number);
    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      return null; 
    }

    try {
      return new Date(year, month - 1, day); 
    } catch (error) {
      return null; 
    }
  }
   
}
