import {Entity} from "../../../arquitetura/shared/models/entity";

export class Patologia extends Entity {
    public codigo?: string;
    public nome?: string;

    public sexo?: string;
    public reembolso?: number;
    public compoeTeto?: string;
    public calculoPartipacao?: string;
    public causaObito?: string;
    public evento?: string;
    public inativo?: string;
    public dataInativacao?: Date;
    public dataCadastramento?: Date;
    public codigoUsuarioCadastro?: string;
    public override id: number;
}
