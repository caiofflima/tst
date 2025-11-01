import {Perfil} from "../../../arquitetura/shared/models/seguranca/perfil";

export class PermissoesSituacaoProcesso {
    public perfil: Perfil[];
    public status: any;
    public acessar: boolean;
    public editar: boolean;
    public analisar: boolean;
    public upload: boolean;
    public titular: boolean;

    /**
     * Tipo de atendimento do processo: análise ou acompanhamento.
     */
    public tipo: string;
}
