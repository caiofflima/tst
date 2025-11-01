import {Entity} from "../../../arquitetura/shared/models/entity";

export class Estado extends Entity {
    public cep: number;
    public nome: string;
    public codigoibge: number;
    public gentilico: string;
    public idintegracaocorpbenner: number;
    public mascarainscricaoestadual: string;
    public mostrarnoportal: string;
    public pais: number;
    public sigla: string;
}
