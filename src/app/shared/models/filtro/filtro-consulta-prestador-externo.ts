import {Entity} from "app/arquitetura/shared/models/entity";

export class FiltroConsultaPrestadorExterno extends Entity {
    public cpf: string;
    public nome: string;
    public ativo: boolean;
    public codigoUsuario: string;
    public idEmpresa: string;
    public perfil: string;
}
