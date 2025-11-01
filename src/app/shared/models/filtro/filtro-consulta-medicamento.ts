import { DadoComboDTO } from './../dto/dado-combo';

export class FiltroConsultaMedicamento {
    public id?: number = null;
    public numeroTuss?: number = null;
    public apresentacao?: string = null;
    public listaLaboratorios?: number[];
    public listaMedicamentos?: number[]; 
    public idListaLaboratorios?: DadoComboDTO[]=[];
    public idListaMedicamentos?: DadoComboDTO[]=[]; 
    public generico?: boolean;
    public ativos?: boolean;

}
