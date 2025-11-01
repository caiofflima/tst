
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FormControl} from "@angular/forms";
import {Location} from "@angular/common";

import {MessageService} from 'app/shared/components/messages/message.service';
import {BaseComponent} from 'app/shared/components/base.component';

import {DadoComboDTO} from 'app/shared/models/dto/dado-combo';
import {ComboService} from 'app/shared/services/comum/combo.service';
import {EmpresaPrestadorExternoService} from 'app/shared/services/comum/empresa-prestador-externo.service';
import { FiltroProcessoReembolso } from './../../../shared/models/filtro/filtro-processo-reembolso';
import * as constantes from 'app/shared/constantes';

import {Util} from "app/arquitetura/shared/util/util";
import {DateUtil} from "app/shared/util/date-util";
import {TipoProcessoService} from "app/shared/services/comum/tipo-processo.service";
import {TipoProcesso} from "app/shared/models/comum/tipo-processo";
import {take} from "rxjs/operators";
import {SessaoService} from "app/arquitetura/shared/services/seguranca/sessao.service";
import {PrestadorExternoService} from "app/shared/services/comum/prestador-externo.service";

@Component({
    selector: 'asc-pesquisar-processo-reembolso-home',
    templateUrl: './pesquisar-processo-reembolso-home.component.html',
    styleUrls: ['./pesquisar-processo-reembolso-home.component.scss']
})
export class PesquisarProcessoReembolsoHomeComponent extends BaseComponent implements OnInit {

    evento = new FormControl(null)
    percReembolso = new FormControl(null)

    filtro: FiltroProcessoReembolso;
    listComboUF: DadoComboDTO[]=[];
    listEmpresas: DadoComboDTO[]=[];
    listComboTipoProcesso: DadoComboDTO[]=[];


    formulario: FormGroup;

    prestadorExterno: any;

    ufsProcessoSelected: DadoComboDTO[]=[];
    empresasAuditoriaSelected:  DadoComboDTO[]=[];
    tipoProcessoSelected:  DadoComboDTO[]=[];

    constructor(
        override readonly messageService: MessageService,
        private readonly router: Router,
        private readonly location: Location,
        private readonly comboService: ComboService,
        private readonly formBuilder: FormBuilder,
        private readonly empresaPrestadorService: EmpresaPrestadorExternoService,
        private readonly tipoProcessoService: TipoProcessoService,
        private readonly sessaoService: SessaoService,
        private readonly prestadorExternoService: PrestadorExternoService,
        private readonly route: ActivatedRoute
    ) {

        super(messageService);

        this.filtro = new FiltroProcessoReembolso();

        this.formulario = this.formBuilder.group({
            'processo': this.formBuilder.control(null),
            'ufsProcesso': [this.filtro.ufsProcesso],
            'empresasAuditoria': [this.filtro.empresasAuditoria],
            'dataInicio': this.formBuilder.control(null, Validators.required),
            'dataFim': this.formBuilder.control(null, Validators.required),
            'tipoProcesso': [this.filtro.tipoProcesso],
        });
    }

    get dataInicio(): AbstractControl {
        return this.formulario.get('dataInicio');
    }

    get dataFim(): AbstractControl {
        return this.formulario.get('dataFim');
    }

    get processo(): AbstractControl {
        return this.formulario.get('processo');
    }

    get ufsProcesso(): AbstractControl {
        return this.formulario.get('ufsProcesso');
    }


    get tipoProcesso(): AbstractControl {
        return this.formulario.get('tipoProcesso');
    }

    get empresasAuditoria(): AbstractControl {
        return this.formulario.get('empresasAuditoria');
    }

    override get constantes(): any {
        return constantes;
    }

    ngOnInit() {
        this.carregarCombos();  
        this.preencherCampos();
    }

    carregarComboPrestador(){
        let usuario = this.sessaoService.getUsuario();
        this.prestadorExternoService.consultarPorCPF(usuario.cpf).subscribe(res=>{
            this.prestadorExterno = res;

            this.empresaPrestadorService.buscarEmpresas().subscribe(res => {
            
                this.listaPrestadorPush(res)


                const ids:any[] = this.route.snapshot.queryParams['idsEmpresasAuditoria'] || null;
                console.log("this.route.snapshot.queryParams['idsEmpresasAuditoria']");
                console.log(this.route.snapshot.queryParams['idsEmpresasAuditoria']);
                if(ids!==null && ids!==undefined){
                    console.log("if(ids!==null){ carregarCombos idsEmpresasAuditoria");
                    console.log(ids);
                    console.log(this.listComboUF);
                    let lista:DadoComboDTO[]=[];
                    ids.forEach(item => {
                        console.log("item");
                        console.log(item);
                        let temp = this.listEmpresas.find(uf=> Number(uf.value) === Number(item));
                        console.log(temp);
                        lista.push(temp);
                    });
                    if(lista!==null && lista.length>0){
                        console.log(lista);
                        this.empresasAuditoriaSelected = lista;
                    }else{
                        this.empresasAuditoriaSelected = [];
                    }
                }
    
            });
        });

    }

    listaPrestadorPush(res:any){
        let listaPrestador = [];
        if(this.prestadorExterno !== null && this.prestadorExterno !== undefined 
            && this.prestadorExterno.empresas !== null){ 
           for(const item of res){
                for(const item2 of this.prestadorExterno.empresas){
                    if(item2.id === item.id){
                        listaPrestador.push(item);
                    }
                } 
           }
        }else{
            listaPrestador = res;
        }
        this.listEmpresas = listaPrestador.map(r=> new DadoComboDTO(r.razaoSocial, r.id, r.razaoSocial));
    }

    carregarCombos(){
        this.comboService.consultarComboUF().pipe(take(1)).subscribe(res => {
            this.listComboUF = res;
            const ids = this.route.snapshot.queryParams['idsUfsProcesso'] || null;
            if(ids!==null && ids!==undefined){
                console.log("if(idsUfsProcesso!==null){ carregarCombos");
                console.log(ids);
                console.log(this.listComboUF);
                let lista:DadoComboDTO[]=[];
                ids.forEach(item => {
                    console.log("item");
                    console.log(item);
                    let temp = this.listComboUF.find(uf=> Number(uf.value) === Number(item));
                    console.log(temp);
                    lista.push(temp);
                });
                if(lista!==null && lista.length>0){
                    console.log(lista);
                    this.ufsProcessoSelected = lista;
                }else{
                    this.ufsProcessoSelected = [];
                }
            }
        }, err => this.showDangerMsg(err.error));

        this.tipoProcessoService.consultarTodos().subscribe(res => {
           
            let listaReembolso = res.filter(item=>item.idTipoPedido === 9 );
            this.listComboTipoProcesso = listaReembolso.map(x=> new DadoComboDTO(x.nome, x.id, x.nome));

            const ids = this.route.snapshot.queryParams['idsTipoProcesso'] || null;
            if(ids!==null && ids!==undefined){
                console.log("if(ids!==null){ carregarCombos listComboTipoProcesso");
                console.log(ids);
                console.log(this.listComboTipoProcesso);
                let lista:DadoComboDTO[]=[];
                ids.forEach(item => {
                    console.log("item ");
                    console.log(item);
                    let temp = this.listComboTipoProcesso.find(uf=> Number(uf.value) === Number(item));
                    console.log(temp);
                    lista.push(temp);
                    this.listComboTipoProcesso.forEach(uf => {
                        console.log(" tipo " + uf.value +" -> "+(Number(uf.value) === Number(item)));
                    });
                });
                if(lista!==null && lista.length>0){
                    console.log(lista);
                    this.tipoProcessoSelected = lista;
                }else{
                    this.tipoProcessoSelected = [];
                }

            }
        }, err => this.showDangerMsg(err.error));
        
        this.carregarComboPrestador();
    }

    carregarPrestador(cpf: string){
        this.prestadorExternoService.consultarPorCPF(cpf).subscribe(res => {
            this.prestadorExterno = res;
        });
    }

    obterData(value: any): Date { 
        if (value !== null){
            if (value instanceof Date) {
                return new Date(value); 
             }
             const [day, month, year] = value.split("/");
             return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        }
        return null;
    }
    
    pesquisar() {
        this.dataInicio.updateValueAndValidity();
        this.dataFim.updateValueAndValidity();
        
        let dtInicio = this.dtInicioSetter();
        let dtFim = this.dtFimSetter();

        dtInicio = Util.getDate(this.obterData(this.dataInicio.value));
        dtFim = Util.getDate(this.obterData(this.dataFim.value));

        let flgValidacaoDatas = false;

        if(dtInicio !== null && dtFim !== null) {
            flgValidacaoDatas = this.validarDataInicioMaiorDataFim(dtInicio, dtFim, "MA099") 
             && this.validarSeDatasEstaoNoPeriodoDeUmAno(dtInicio, dtFim, "MA165");
        }

        if(flgValidacaoDatas){
            let descEmpresasAuditoria:any;
            let idsEmpresasAuditoria:any;
            console.log("this.formulario.get('empresasAuditoria').value ===============");
            console.log(this.formulario.get('empresasAuditoria').value);
            if(this.formulario.get('empresasAuditoria').value!==null && this.formulario.get('empresasAuditoria').value!==undefined){
                descEmpresasAuditoria = this.formulario.get('empresasAuditoria').value.map(v => v.label).join(', ');
                idsEmpresasAuditoria = this.formulario.get('empresasAuditoria').value.map(v => v.value);
            }
    
            let descUfsProcesso:any;
            let idsUfsProcesso:any;
            if(this.formulario.get('ufsProcesso').value!==null && this.formulario.get('ufsProcesso').value!==undefined){
                descUfsProcesso = this.formulario.get('ufsProcesso').value.map(v => v.label).join(', ');
                idsUfsProcesso = this.formulario.get('ufsProcesso').value.map(v => v.value);
            }
    
            let descTipoProcesso:any;
            let idsTipoProcesso: any;
            if(this.formulario.get('tipoProcesso').value !== null && this.formulario.get('tipoProcesso').value !== undefined){
                descTipoProcesso = this.formulario.get('tipoProcesso').value.map(v => v.label).join(', ');
                idsTipoProcesso = this.formulario.get('tipoProcesso').value.map(v => v.value);
            }

            this.router.navigate(['/relatorios/pesquisar-pedido-reembolso/buscar'], {
                queryParams: {
                    processo: this.verificaParametro(this.formulario.get('processo').value),
                    descUfsProcesso:  descUfsProcesso,
                    descEmpresasAuditoria: descEmpresasAuditoria,
                    idsUfsProcesso:  idsUfsProcesso,
                    idsEmpresasAuditoria: idsEmpresasAuditoria ,
                    dataInicio: this.formatarData(this.formulario.get('dataInicio').value),
                    dataFim: this.formatarData(this.formulario.get('dataFim').value),
                    descTipoProcesso: descTipoProcesso,
                    idsTipoProcesso:  idsTipoProcesso,
                }
            });
        }else if(dtInicio === null || dtFim === null){
            this.showDangerMsg("MA007");
        }

    }

    dtInicioSetter(){
        return this.dataInicio.value === "" ? null : this.dataInicio.value
    }
    dtFimSetter(){
        return this.dataFim.value === "" ? null : this.dataFim.value
    }

    protected validarDataInicioMaiorDataFim(dtInicio: Date, dtFim: Date, msg: string): boolean {
        let flg = true;
        if (null != dtInicio && null != dtFim) {
            if (dtInicio.getTime() > dtFim.getTime()) {
                this.showDangerMsg(msg);
                flg = false;
            }
        }
        return flg
    }

    private validarSeDatasEstaoNoPeriodoDeUmAno(dataInicio: Date, dataFim: Date, message: string): boolean {
        const dias: number = 365;
        const diasBissexto: number = 366;
        const diferencaEmMilissegundos: number = Math.abs(dataInicio.getTime() - dataFim.getTime());
        const diferencaEmDias: number = diferencaEmMilissegundos / (1000 * 60 * 60 * 24);
        const contemAnoBissexto: boolean = this.ehAnoBissexto(dataInicio.getFullYear()) || this.ehAnoBissexto(dataFim.getFullYear());

        if (diferencaEmDias > dias && !contemAnoBissexto) {
            this.showDangerMsg(message);
            return false;
        } else if (contemAnoBissexto && diferencaEmDias > diasBissexto) {
            this.showDangerMsg(message);
            return false;
        }

        return true;
    }

    private ehAnoBissexto(ano: number): boolean {
        return (ano % 4 === 0 && ano % 100 !== 0) || ano % 400 === 0;
    }

    protected validarDiferencaDatasMenorIgual(dtInicio: Date, dtFim: Date, dias: number, msg: string): boolean {
        let flg = true;
        if (null != dtInicio && null != dtFim) {
            let emDias = (dtFim.getTime() - dtInicio.getTime()) / (1000 * 60 * 60 * 24);
            emDias = emDias < 0 ? emDias * -1 : emDias;
            if (emDias > dias) {
                this.showDangerMsg(msg);
                flg = false;
            }
        }
        return flg
    }

    private formatarData(strData:string):any{
        console.log("strData = " + strData + " = " + strData.length);
        if(strData !== null && strData !== undefined){
            
            if(strData.length === 10){
                return strData;
            }else{
                let data: Date = Util.getDate(strData);
                return Util.dateToStringBr(data);
            }
            
        }
        return null;
    }

    private verificaParametro(objeto: any):any{
        if(objeto !== null && objeto !== undefined ){
            return objeto;
        }
        return null;
    }

    limparCampos() {
        this.filtro = new FiltroProcessoReembolso();
        this.formulario.reset();
        this.formulario.markAsPristine();
        this.formulario.markAsUntouched();
        this.formulario.updateValueAndValidity();
    }

    retornar() {
        this.router.navigate(['/relatorios/pesquisar-processo-reembolso/']);
    }

    voltar(): void {
        this.location.back();
    }

    private preencherCampos(): void{
        if(this.route.snapshot.queryParams){
            const processo = this.route.snapshot.queryParams['processo'] || '';
            const dataInicio = this.route.snapshot.queryParams['dataInicio'] || '';
            const dataFim = this.route.snapshot.queryParams['dataFim'] || '';
    
            if(processo!==null && processo.length>0){
                this.formulario.get('processo').setValue(processo);
            }

            if(dataInicio!==null && dataInicio !== undefined){
               this.dataInicio.setValue(dataInicio);
            }
    
            if(dataFim!==null && dataFim !== undefined){
                this.dataFim.setValue(dataFim);
            }

        }
    }
}
