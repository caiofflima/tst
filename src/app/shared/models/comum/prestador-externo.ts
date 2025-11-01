import {Entity} from "app/arquitetura/shared/models/entity";
import {EmpresaPrestadora} from "./empresa-prestadora";

export class PrestadorExterno extends Entity {
    public override id: number;
    public cpf: string;
    public nome: string;
    public email: string;
    public ativo: string;
    public empresas: any[];
    public dataNascimento: Date;
    public codigoUsuario: string;
    public dataCadastramento: Date;
    public prestadoresEmpresa: any[];
    public usuarioCadastramento: string;
    public perfilPrestadorExterno: any[];
    public matriculaCadastramento: string;
    public atuacaoPrestadorExterno: any[];
    public dataLimitePrestadorExterno: Date;
    public empresaPrestadorExterno: EmpresaPrestadora;
    public perfisPrestador: any[];
    public tipoPrestador: any;
}
