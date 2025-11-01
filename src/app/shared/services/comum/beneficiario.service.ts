import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {CrudHttpClientService} from 'app/arquitetura/shared/services/crud-http-client.service';
import {Observable} from 'rxjs';
import {Beneficiario} from 'app/shared/models/entidades';
import {FiltroSolicitacaoCredenciado} from 'app/shared/models/dtos';
import {MessageService} from "../../components/messages/message.service";
import { CartaoDTO } from 'app/shared/models/comum/cartao-dto.model';
import { HandleBeneficiariosDTO } from 'app/shared/models/comum/handle-beneficiarios-dto.model';
import { DetalheBeneficiarioDTO } from 'app/shared/models/comum/detalhe-beneficiario-dto.model';
import { PortabilidadeDTO } from 'app/shared/models/comum/portabilidade-dto.model';
import { ContratoDTO } from '../../../shared/models/dto/contrato';

@Injectable()
export class BeneficiarioService extends CrudHttpClientService<Beneficiario> {

    constructor(
        override readonly messageService: MessageService,
        protected override readonly http: HttpClient
    ) {
        super('beneficiarios', http, messageService);
    }

    getTitle(){
        return "Minha Família"
    }

    public consultarTitularPorBeneficiario(idBeneficiario: number): Observable<Beneficiario> {
        return this.http.get<Beneficiario>(this.url + '/beneficiario/' + idBeneficiario + '/titular', this.options());
    }

    public consultarBeneficiarioPorMatricula(matricula: string): Observable<Beneficiario> {
        return this.http.get<Beneficiario>(this.url + '/consultarBeneficiarioPorMatricula/' + matricula, this.options());
    }

    public verificarSeEmpregadoEstaAtivoPorMatricula(matricula: string): Observable<boolean> {
        return this.http.get<boolean>(this.url + '/verificarSeEmpregadoEstaAtivoPorMatricula/' + matricula, this.options());
    }

    public consultarTitularPorMatricula(matricula: string, carregarDependentes?: boolean): Observable<Beneficiario> {
        let params = new HttpParams();
        if (carregarDependentes) {
            params = params.set('dependentes', 'true')
        }
        let options = this.options();
        if (params.keys().length > 0) {
            options = this.options({params});
        }

        return this.http.get<Beneficiario>(`${this.url}/titular/matricula/${matricula}`, options);
    }

    public consultarBeneficiarioAtivoPorMatricula(matricula: string): Observable<Beneficiario> {
        return this.http.get<Beneficiario>(this.url + "/consultarBeneficiarioAtivoPorMatricula/" + matricula, this.options());
    }

    public consultarPorMatricula(matricula: string): Observable<Beneficiario> {
        return this.http.get<Beneficiario>(this.url + '/matricula/' + matricula, this.options());
    }

    public consultarFamiliaPorMatricula(matricula: string, apresentaTitular: boolean, mostrarTodos = false): Observable<Beneficiario[]> {
        return this.http.get<Beneficiario[]>(`${this.url}/matricula/${matricula}/familia?titular=${apresentaTitular}&todos=${mostrarTodos}`, this.options());
    }

    public consultarTodaFamiliaPorMatricula(matricula: string): Observable<Beneficiario[]> {
        return this.http.get<Beneficiario[]>(`${this.url}/getTodosFamiliares/${matricula}`, this.options());
    }

    public consultarTodaFamiliaPorMatriculaRenovacao(matricula: string): Observable<Beneficiario[]> {
        return this.http.get<Beneficiario[]>(`${this.url}/getTodosFamiliares/${matricula}?renovacao=true`, this.options());
    }

    public verificarCpfFamiliaDiferente(cpfDependente: string, cpfTitular: string): Observable<boolean> {
        const params = new HttpParams()
            .set('cpfDependente', cpfDependente)
            .set('cpfTitular', cpfTitular);

        return this.http.get<boolean>(`${this.url}/verificarCpfFamiliaDiferente`, { params });
    }


    public consultarBeneficiarioPorId(idBeneficiario: number): Observable<Beneficiario> {
        return this.http.get<Beneficiario>(this.url + '/' + idBeneficiario);
    }

    public consultarTitularPorIdPedido(idPedido: number): Observable<Beneficiario> {
        return this.http.get<Beneficiario>(this.url + '/titular/pedido/' + idPedido);
    }

    public consultarBeneficiarioParaSolicitacaoCredenciado(filtro: FiltroSolicitacaoCredenciado): Observable<Beneficiario> {
        return this.http.post<Beneficiario>(this.url + '/beneficiario/solicitacao-credenciado', filtro, this.options());
    }

    public getDadosCartaoBeneficiario(idBeneficiario: number): Observable<CartaoDTO> {
        return this.http.get<CartaoDTO>(this.url + `/getDadosCartaoBeneficiario/${idBeneficiario}`);
    }

    public getDadosBeneficiarioCartaoPlano(idBeneficiario: number): Observable<DetalheBeneficiarioDTO> {
        return this.http.get<DetalheBeneficiarioDTO>(this.url + `/getDadosBeneficiarioCartaoPlano/${idBeneficiario}`);
    }

    public consultarTitularPorCPF(cpf: string): Observable<Beneficiario> {
        console.log("consultarTitularPorCPF("+cpf+": string)");
        console.log(this.url + '/titular/cpf/' + cpf);
        return this.http.get<Beneficiario>(this.url + '/titular/cpf/' + cpf, this.options());
    }

    public consultarDependentePorCPF(cpf: string): Observable<Beneficiario> {
        console.log("consultarTitularPorCPF("+cpf+": string)");
        console.log(this.url + '/dependente/cpf/' + cpf);
        return this.http.get<Beneficiario>(this.url + '/dependente/cpf/' + cpf, this.options());
    }

    public consultarBeneficiariosPorIds(handleBeneficiarios: HandleBeneficiariosDTO): Observable<Beneficiario[]> {
        return this.http.post<Beneficiario[]>(this.url + '/consultarBeneficiariosPorIds', handleBeneficiarios, this.options());
    }
    
    public consultarPorCPF(cpf: string): Observable<Beneficiario> {
        console.log("consultarPorCPF("+cpf+": string)");
        console.log(this.url + '/cpf/' + cpf);
        return this.http.get<Beneficiario>(this.url + '/cpf/' + cpf, this.options());
    }

    public consultarBeneficiarioETitularPorMatricula(matricula: string): Observable<Beneficiario[]> {
        return this.http.get<Beneficiario[]>(`${this.url}/beneficiario-titular/portabilidade/${matricula}`, this.options());
    }

    
    public consultarBeneficiarioETitularContratoPorMatricula(matricula: string): Observable<Beneficiario[]> {
        return this.http.get<Beneficiario[]>(`${this.url}/beneficiario-titular-contrato/portabilidade/${matricula}`, this.options());
    }

    public getDadosCartaPortabilidadeBeneficiario(idBeneficiario: number): Observable<PortabilidadeDTO> {
        return this.http.get<PortabilidadeDTO>(this.url + `/beneficiario/carta-portabilidade/${idBeneficiario}`);
    }

    public consultarContratosBeneficiarioPorMatricula(matricula: string): Observable<ContratoDTO[]> {
        return this.http.get<ContratoDTO[]>(this.url + `/beneficiario-titular-contratos/${matricula}`);
    }

    public consultarTitularPorMatriculaFamilia(matricula: string, carregarDependentes?: boolean, familia?: string): Observable<Beneficiario> {
        let params = new HttpParams();
        if (carregarDependentes) {
            params = params.set('dependentes', 'true');
            params = params.set('familia', familia);
        }
        let options = this.options();
        if (params.keys().length > 0) {
            options = this.options({params});
        }
  
        return this.http.get<Beneficiario>(`${this.url}/titular/matricula/${matricula}`, options);
    }
}
