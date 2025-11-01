import {Entity} from '../../../../app/arquitetura/shared/models/entity';
import {PedidoProcedimento} from './pedido-procedimento';
import {GrauProcedimento} from './grau-procedimento';
import {TipoProcesso} from './tipo-processo';

export class Procedimento extends Entity {

  public nome: string;
  public graus: GrauProcedimento[];
  public idTipoProcesso: number;
  public descricao: string;
  public tipoProcesso: TipoProcesso;
  public pedidosProcedimento: PedidoProcedimento[];
  public grausProcedimento: GrauProcedimento[];
  public descricaoProcedimento: string;
  public estruturaNumerica: string;
  public observacaoProcedimento?: string;
  public providenciaNaFalta?: string;
  public prazoIntervalar?: number;
  public noTipoProcesso: string;
  public noNivelAutorizacao: string;
  public sexo?: string;
  public idadeMinima?: string;
  public idadeMaxima?: string;
}
