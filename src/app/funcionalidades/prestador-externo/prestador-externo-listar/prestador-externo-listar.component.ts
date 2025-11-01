import { AtuacaoProfissionalPipe } from './../../../shared/pipes/atuacao-profissional.pipe';
import {take} from "rxjs/operators";
import {Component,ViewChild} from "@angular/core";
import {Location} from "@angular/common";
import {ActivatedRoute} from "@angular/router";

import {Util} from "app/arquitetura/shared/util/util";
import * as constantes from 'app/shared/constantes';
import {DadoComboDTO} from "../../../shared/models/dto/dado-combo";
import {ComboService} from 'app/shared/services/services';
import {BaseComponent} from "app/shared/components/base.component";
import {MessageService} from "app/shared/components/messages/message.service";
import {PrestadorExternoService} from "app/shared/services/comum/prestador-externo.service";
import {FiltroConsultaPrestadorExterno} from "app/shared/models/filtro/filtro-consulta-prestador-externo";
import {EmpresaPrestadorExternoService} from "app/shared/services/comum/empresa-prestador-externo.service";
import {PrestadorExterno} from "../../../shared/models/comum/prestador-externo";
import {UsuarioExternoDTO} from 'app/shared/models/dto/usuario-externo';

@Component({
    selector: "app-prestador-externo-listar",
    templateUrl: "./prestador-externo-listar.component.html",
    styleUrls: ["./prestador-externo-listar.component.scss"]
})
export class PrestadorExternoListarComponent extends BaseComponent {

    @ViewChild('caixaTablePrestadorExternoListar')caixaTablePrestadorExternoListar:any


    lista: any[];
    loading = false;
    filtro: FiltroConsultaPrestadorExterno;
    listComboPerfil: any;
    empresas: any[];
    nomePerfil: String="";
    nomeEmpresa: String="";
    usuariosExternos: UsuarioExternoDTO[];

    constructor(
        private readonly location: Location,
        override readonly messageService: MessageService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly prestadorExternoService: PrestadorExternoService,
        private readonly comboService: ComboService,
        private readonly empresaService: EmpresaPrestadorExternoService,
    ) {
        super(messageService);
        this.filtro = new FiltroConsultaPrestadorExterno();
        this.filtro.cpf = this.activatedRoute.snapshot.queryParams['cpf'];
        this.filtro.nome = this.activatedRoute.snapshot.queryParams['nome'].toUpperCase();
        this.filtro.ativo = this.activatedRoute.snapshot.queryParams['ativo'];
        this.filtro.codigoUsuario = this.activatedRoute.snapshot.queryParams['codigoUsuario'];
        // this.filtro.idEmpresa = this.activatedRoute.snapshot.queryParams['idEmpresa'];
        this.filtro.perfil = this.activatedRoute.snapshot.queryParams['perfil'];

        this.loading = true;
        this.prestadorExternoService.consultarPorFiltro(this.filtro).pipe(
            take<UsuarioExternoDTO[]>(1)
        ).subscribe(res => { 
            this.usuariosExternos = res;
            this.lista = res.map(pe => ({
                id: pe.id,
                cpf: pe.cpf,
                nome: pe.nome.toUpperCase(),
                email: pe.email,
                codigoUsuario: pe.codigoUsuario,
                dataNascimento: pe.dataNascimento,
                inativo: pe.ativo == "S" ? "Não" : "Sim"
            }));
            this.loading = false;
        }, error => {
            this.loading = false;
            this.showDangerMsg(error.error)
        });
    }

    ngOnInit() {
        this.inicializarCombos();
    }

    public voltar(): void {
        this.location.back();
    }

    public inicializarCombos(): void {
        this.comboService.consultarComboPerfisPrestadoresExternos().pipe(
            take<DadoComboDTO[]>(1)
        ).subscribe(perfis => {
            if(this.filtro.perfil){  
                let item = perfis.find(item=> item.value === this.filtro.perfil);
                if(item){
                    this.nomePerfil = item.label;
                }
            }
        }, err => this.messageService.addMsgDanger(err.error));

        this.empresaService.buscarEmpresas().subscribe(empresas => { 
            if(this.filtro.idEmpresa){  
                let item = empresas.find(item=> String(item.id) === this.filtro.idEmpresa);
                if(item){ 
                    this.nomeEmpresa = item.razaoSocial;
                }
            }
        }, err => this.messageService.addMsgDanger(err.error));
    }
      
    public exportarExcel(){
        let dadosExportar: any[]=[];

        this.usuariosExternos.forEach(usuario=>{  
            if(usuario.empresas && usuario.empresas.length>0){
                this.handleUsuarioPossuiEmpresasExportarExcel(usuario,dadosExportar)
            }else{
                this.handleUsuarioNaoPossuiEmpresasExportarExcel(usuario,dadosExportar)
             
            }
        });

        const columnNames =  ['ID', 'CPF', 'Nome', 'Código do Usuário', 'E-mail', 'Data Nascimento', 'Inativo','Empresa','Perfil','Atuação Profissional','DataLimite'];
        const ordemColumnNames = ['id', 'cpf', 'nome', 'codigoUsuario',  'email','dataNascimento', 'inativo','empresa','perfil','atuacaoProfissional','dataLimite'];
        const agora = new Date();
        const nomeArquivo = "prestador_externo_"+ Util.dateTimeToStringBr(agora).replace(/\//g,'_').replace(/[\s:]/g,'_');
        this.exportToCSV(dadosExportar, nomeArquivo, columnNames, ordemColumnNames);
    }
    handleUsuarioNaoPossuiEmpresasExportarExcel(usuario:any,dadosExportar:any){
        if(usuario.perfisPrestador && usuario.perfisPrestador.length>0){
            usuario.perfisPrestador.forEach(perfil=>{
                dadosExportar.push({
                id: usuario.id,
                cpf: constantes.cpfCnpjUtil.configurarMascara(usuario.cpf),
                nome: usuario.nome.toUpperCase(),
                email: usuario.email,
                codigoUsuario: usuario.codigoUsuario,
                dataNascimento: Util.dateToStringBr(usuario.dataNascimento),
                inativo: usuario.ativo == "S" ? "Não" : "Sim",
                empresa: "",  
                perfil: perfil.perfil,
                atuacaoProfissional: perfil.atuacaoProfissional,
                dataLimite: Util.dateToStringBr(perfil.dataLimite)                                  
                });
            });
        }else{
            dadosExportar.push({
            id: usuario.id,
            cpf: constantes.cpfCnpjUtil.configurarMascara(usuario.cpf),
            nome: usuario.nome.toUpperCase(),
            email: usuario.email,
            codigoUsuario: usuario.codigoUsuario,
            dataNascimento: Util.dateToStringBr(usuario.dataNascimento),
            inativo: usuario.ativo == "S" ? "Não" : "Sim",
            empresa: "",  
            perfil: "",
            atuacaoProfissional: "",
            dataLimite: ""                                  
            });
        }
    }

    handleUsuarioPossuiEmpresasExportarExcel(usuario:any,dadosExportar:any){
        usuario.empresas.forEach(empresa=>{
            if(usuario.perfisPrestador && usuario.perfisPrestador.length>0){
                usuario.perfisPrestador.forEach(perfil=>{
                    if(empresa.id === perfil.idEmpresa){
                        dadosExportar.push({
                            id: usuario.id,
                            cpf: constantes.cpfCnpjUtil.configurarMascara(usuario.cpf),
                            nome: usuario.nome.toUpperCase(),
                            email: usuario.email,
                            codigoUsuario: usuario.codigoUsuario,
                            dataNascimento: Util.dateToStringBr(usuario.dataNascimento),
                            inativo: usuario.ativo == "S" ? "Não" : "Sim",
                            empresa: empresa.razaoSocial,  
                            perfil: perfil.perfil,
                            atuacaoProfissional: perfil.atuacaoProfissional,
                            dataLimite: Util.dateToStringBr(perfil.dataLimite)                                  
                            });
                    }
                });
            }else{
                 usuario.empresas.forEach(empresa=>{
                    dadosExportar.push({
                    id: usuario.id,
                    cpf: constantes.cpfCnpjUtil.configurarMascara(usuario.cpf),
                    nome: usuario.nome.toUpperCase(),
                    email: usuario.email,
                    codigoUsuario: usuario.codigoUsuario,
                    dataNascimento: Util.dateToStringBr(usuario.dataNascimento),
                    inativo: usuario.ativo == "S" ? "Não" : "Sim",
                    empresa: empresa.razaoSocial,  
                    perfil: "",
                    atuacaoProfissional: "",
                    dataLimite: ""                                  
                    });
                });
            }
        });
    }

    exportToCSV(data: any[], fileName: string, columnNames: string[], ordemColumnNames: string[])
    {
		const rows = data.map(obj => this.mapObjectToColumn(obj, ordemColumnNames));
		
		const header = columnNames.join(';');
		
        const csv = "\ufeff" + [header, ...rows].join('\n'); /* \ufeff - acrescentado para ativar o charset */
		
        const blob = new Blob([csv], { type: "text/plain; charset=utf-8" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.csv`
        a.click();
        window.URL.revokeObjectURL(url);
    }

    convertToCSV(data: any, columnNames: string[]){
        const header = columnNames.join(';');
        const rows = data.map(obj => this.getObjectValues(obj).join(';'));
        return [header, ...rows].join('\n');
    }

    getObjectValues(obj: any){
        return Object.keys(obj).map(key => obj[key]);
    }

    mapObjectToColumn(obj:any, columnNames: string[]){
        return columnNames.map(col => obj[col]).join(';');
    }

    applyGlobalFilter(evento:Event){
        const input = evento.target as HTMLInputElement
        const value = input.value
        this.caixaTablePrestadorExternoListar.filterGlobal(value,'contains')
    }
}
