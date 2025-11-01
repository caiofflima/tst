import { Medicamento } from "./medicamento";

export class MedicamentoPatologia {
    public id?: number;
    public idMedicamento?: number;
    public idPatologia?: number;
    public coMedicamento?: number;
    public descricaoHistorico?: string;
    public inativo?: string;
    public dataInativacao?: Date;
    public dataCadastramento?: Date;
    public codigoUsuarioCadastramento?: string;
    public nomePatologia?: string;
    public nomeMedicamento?: string;
    public descInativo?: string;
    public patologiaCodigo?: string;
    public nomeLaboratorio?: string;
    public nomeApresentacao?: string;
    public numeroTiss?: number;
    public reembolso?: number;
    public compoeTeto?: string;
}
