import {Entity} from 'app/arquitetura/shared/models/entity';

import {Contrato} from './contrato';
import {VinculoFuncional} from './vinculo-funcional';
import {Contato} from './contato';
import {Endereco} from './endereco';
import {TipoBeneficiario} from './tipo-beneficiario';
import {Matricula} from "../../../arquitetura/shared/models/cadastrobasico/usuario";
import {EstadoCivil} from "./estado-civil";

export class Beneficiario extends Entity {

  public nome: string = null;
  public cpf: string = null;
  public contato: Contato = new Contato();
  public endereco: Endereco = new Endereco();
  public codFamilia: number;
  public dtNascimento: Date = null;
  public nomeMae: string = null;
  public nomePai: string = null;
  public estadoCivil: EstadoCivil = null;
  public sexo: string = null;

  public matricula: Matricula = null;
  public matriculaFuncional: string = null;
  public tipo: string = null;
  public restrito: string = null;
  public situacao: string = null;
  public codBeneficiario: string = null;
  public codigoBeneficiario: string = null;
  public contrato: Contrato = new Contrato();
  public tipoDesconto: string = null;

  public nuCartao: string = null;
  public nuConta: string = null;
  public dtInicioCartao: Date = null;
  public dtFimCartao: Date = null;
  public cns: string = null;

  public celular: string;
  public remuneracaoBase: string = null;
  public filial: string = null;
  public vinculoFuncional: VinculoFuncional = new VinculoFuncional();
  public beneficiarios: Beneficiario[] = [];
  public dependentes: Beneficiario[] = [];
  public titular: Beneficiario;
  public tipoDependente: TipoBeneficiario;
  public ehTitular: boolean;
  public contratoTpdep: ContratoTpdep;
  public codigoAntigo: string;
  public email: string;
  public idTipoDeficiencia: number;
  public codigoDependente: string;
  public motivocancelamento: number;
  public conta: string;
	public contadv: string;
	public agencia: string;
  public operacao: string;
  public dataCancelamento: Date = null;
  public contaFin: ContaFin;
}

interface ContratoTpdep {
  id: number;
  tipoDependente: TipoDependente;
  contrato: number;
  datafinal?: any;
  datainicial: string;
  gerarcartaorenovacao: string;
  idademaxima: number;
  k9Assumirvalidadecarttitular: string;
  obrigatorio: string;
  qtdmaxima?: any;
  idTipoBeneficiario: number;
  verificarcontribprevidencia: string;
  zgrupo?: any;
}

interface ContaFin {
  id: number;
  tipoDocumentoAgs: TipoDocumentoAgs;
}

interface TipoDocumentoAgs {
  id: number;
  descricao: string;
}

export interface TipoDependente {
  id: number;
  autonomo: string;
  codigo: number;
  codigoexterno?: any;
  criticasexotitular: string;
  descricao: string;
  grupodependente: string;
  k9Deprestrito: string;
  parentesco: number;
  percentualcontribuicao?: any;
  relacaodependenciadmed: string;
  codigoans: string;
  zgrupo?: any;
  ehConjugeOuCompanheiro?: Boolean;
}
