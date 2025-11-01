import {Email, SituacaoProcesso} from '../../../../app/shared/models/entidades';
import {PedidoDTO} from '../../../../app/shared/models/dtos';

export interface MensagemPedidoDTO {
    id: number;
    idPedido: number;
    idEmail: number;
    dataHoraEnvio: Date;
    lido: string;
    encaminhada: string;
    reenviada: string;
    emailDestinatario: string;
    emailDistintoReenvio: string;
    textoEmailEnviado: string;
    codigoUsuarioCadastramento: string;
    pedido: PedidoDTO;
    email: Email;
    situacaoProcesso: SituacaoProcesso;
    emailRemetente: string;
    copiaPara: any;
}
