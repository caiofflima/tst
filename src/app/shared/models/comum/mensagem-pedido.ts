import {Email} from "./email";
import {Pedido} from "./pedido";

export class MensagemPedido {

  public id: number;
  public idPedido: number;
  public idEmail: number;
  public dataHoraEnvio: Date;
  public pedido: Pedido;
  public email: Email;
  public lido: string;
  public encaminhada: string;
  public reenviada: string;
  public emailDestinatario: string;
  public emailDistintoReenvio: string;

}
