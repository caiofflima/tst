import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {SessaoService} from '../../../../app/arquitetura/shared/services/seguranca/sessao.service';
import {ExportacaoService} from '../comum/exportacao.service';
import {BeneficiarioService} from '../comum/beneficiario.service';

import {Beneficiario} from '../../../../app/shared/models/comum/beneficiario';
import { CartaoIdentificacaoService } from '../cartao-identificacao/cartao-identificacao.service';

@Injectable()
export class MeusDadosService {

    constructor(
        public sessaoService: SessaoService,
        private exportacaoService: ExportacaoService,
        private beneficiarioService: BeneficiarioService,
        private cartaoIdService: CartaoIdentificacaoService
    ) {
    }

    public carregarTitular(matricula: string): any {
        return this.beneficiarioService.consultarTitularPorMatricula(matricula);
    }

    public exportarPDF(beneficiario: Beneficiario): Observable<any> {
        return this.exportacaoService.exportarPDF('/beneficiario/declaracao-permanencia', beneficiario);
    }

    public enviarCartaoEmail(beneficiario: Beneficiario): Observable<any> {
        return this.cartaoIdService.enviarCartaoEmail(beneficiario);
    }

    getBeneficiarios(): Array<Beneficiario> {
        return [];
    }
}
