import {Entity} from '../../../../../app/arquitetura/shared/models/entity';
import {Perfil} from '../../../../../app/arquitetura/shared/models/seguranca/perfil';

export interface DadosPrestadorExterno {
    id: number;

    ativo: string;

    codigoPerfil: string;

    perfis: string[];

    tipoAuditor: string[];

    codigoContrato: string;

    inicioContrato: Date;

    fimContrato: Date;

    idsFiliais: number[];

    credenciados: any[];

    tipoCredenciado: boolean;
}

export class Usuario extends Entity {
    public login: string | null = null;
    public matricula: string | null = null;
    public matriculaFuncional: string;
    public nome: string | null = null;
    public cpf: string | null = null;
    public email: string | null = null;
    public unidade: string | null = null;
    public perfis: Perfil[] | null = null;
    public recursos: string[] | null = null;
    public menu: any[] | null = null;
    public perfilDesc: string | null = null;
    public dadosPrestadorExterno: DadosPrestadorExterno;
    public idCredenciadoSelecionado: number;
    public idTitular: number;
    public sexo: string;

    public hasPerfil(perfil: string | string[]): boolean {
        let flg = false;
        if (this.perfis) {
            flg = this.perfis.some(p => {
                if (perfil instanceof String) {
                    return p.codigo == perfil;
                } else {
                    return perfil.includes(p.codigo as string);
                }
            });
        }
        return flg;
    }

    public getDescricaoPerfis(): string {
        if (!this.perfilDesc) {
            let desc = '';
            if (this.perfis) {
                for (let p of this.perfis) {
                    desc = desc + p.descricao + ', ';
                }
            }
            this.perfilDesc = desc.substr(0, desc.length - 2);
        }
        return this.perfilDesc;
    }
}

export interface Matricula {
    id: number;
    atividadeprincipal?: any;
    cancelamentofraude: string;
    cartaonacionalsaude: string;
    cidfalecimento?: any;
    complementodispensacaddigital?: any;
    cpf?: any;
    dadosimpressaodigital?: any;
    dataadocao?: any;
    datacasamento?: any;
    dataexpedicaodocidentificacao?: any;
    dataexpedicaorg?: any;
    dataexppassaporte?: any;
    datafalecimento?: any;
    datainclusaoprevidencia?: any;
    dataingresso?: any;
    dataNascimento: string;
    dnv?: any;
    documentoidentificacao?: any;
    ehindicador: string;
    estado?: any;
    filial?: any;
    graudedependencia?: any;
    grauinstrucao?: any;
    inadimplente: string;
    iniciais: string;
    k9Dependenteir?: any;
    matricula: number;
    motivodispensacaddigital?: any;
    municipio?: any;
    naturezadocidentificacao?: any;
    nome: string;
    nomeMae: string;
    nomePai: string;
    orgaoemissor?: any;
    orgaoemissordocidentificacao?: any;
    orgaoemissorpassaporte?: any;
    passaporte?: any;
    pispasep?: any;
    resultadoisbe?: any;
    rg?: any;
    sexo: string;
    tabcadastroimpressaodigital: number;
    idTipoDeficiencia?: any;
    tituloeleitor?: any;
    zdatacancsisantigo?: any;
    znome: string;
    zgrupo?: any;
}

