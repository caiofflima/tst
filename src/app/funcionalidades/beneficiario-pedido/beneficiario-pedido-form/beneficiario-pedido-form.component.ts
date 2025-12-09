import {Component, Input} from '@angular/core';
import {BaseComponent} from "../../../shared/components/base.component";
import {MessageService} from "../../../shared/components/messages/message.service";

import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

import {DadoComboDTO} from "../../../shared/models/dto/dado-combo";
import {map, switchMap, take, tap} from "rxjs/operators";
import {TipoBeneficiarioService} from "../../../shared/services/comum/tipo-beneficiario.service";
import {Location} from "@angular/common";
import {Util} from "../../../arquitetura/shared/util/util";
import { BeneficiarioPedidoService, ComboService, PerfilMinimoService } from 'app/shared/services/services';
import { BeneficiarioPedido } from 'app/shared/models/comum/beneficiario-pedido';
import { Loading } from 'app/shared/components/loading/loading-modal.component';
import { isNotUndefinedOrNull } from 'app/shared/constantes';
import { BehaviorSubject } from 'rxjs';
import { of } from 'rxjs';
import { SelectItem } from 'primeng/api';

import { CheckboxChangeEvent } from 'primeng/checkbox';
@Component({
    selector: 'asc-beneficiario-pedido-form',
    templateUrl: './beneficiario-pedido-form.component.html',
    styleUrls: ['./beneficiario-pedido-form.component.scss']
})
export class BeneficiarioPedidoFormComponent extends BaseComponent {
    titulo: string
    loading: boolean
    loadingRM: boolean
    beneficiarioPedido = new BeneficiarioPedido();
    beneficiarioPedidoParam = new BeneficiarioPedido();
    showProgress = false;
    listComboTipoBeneficiario: DadoComboDTO[];
    listComboPerfil: DadoComboDTO[];
    restauraPrazoTratamento: BeneficiarioPedido;
    itensSituacoesProcesso: SelectItem[] = [];

    idSituacaoProcesso = this.formBuilder.control(null);
    idTipoProcesso = this.formBuilder.control(null);
    beneficiariosAssociados = this.formBuilder.control(null);
    tiposBeneficiario = this.formBuilder.control(null);
    perfis = this.formBuilder.control(null);
    
    dataInativacao = this.formBuilder.control(null);
    inativo = this.formBuilder.control(false);
    tipoProcesso: any
    override baseURL: string
    rotaListar: string
    @Input() compStyle!: any
    id: any
    formulario: FormGroup = this.formBuilder.group({
        id: this.formBuilder.control(null),
        idTipoProcesso: this.idTipoProcesso,
        tiposBeneficiario: [null, Validators.required],
        dataInativacao: this.dataInativacao,
        inativo: this.inativo,
        nomeBeneficario: [{value: null, disabled: true}],
        beneficiariosAssociados: this.beneficiariosAssociados,
        perfis: this.perfis
    })
    valuePerfil: DadoComboDTO[] = []
    loadinTipoBeneficiario = false
    loadginBehavior = new BehaviorSubject<boolean>(false)
    constructor(
        private readonly router: Router,
        private readonly location: Location,
        private readonly route: ActivatedRoute,
        private readonly formBuilder: FormBuilder,
        private readonly beneficiarioPedidoService: BeneficiarioPedidoService,
        private readonly tipoBeneficiarioService: TipoBeneficiarioService,
        override readonly messageService: MessageService,
        private readonly perfilMinimoService: PerfilMinimoService
    ) {
        super(messageService);
        const params = this.route.snapshot.params['id'];
        this.id = params
        this.beneficiarioPedidoParam = params ? JSON.parse( this.b64_to_utf8( params ) ) : null
        
        
        if( params )
            this.nomeTipoBeneficiario.setValue( this.beneficiarioPedidoParam.nomeTiposBeneficiario )
        
        
        this.titulo = beneficiarioPedidoService.getTitulo()
        this.baseURL = this.beneficiarioPedidoService.getBaseURL()
        this.rotaListar = `${this.baseURL}/buscar`
        this.atualizaLoading()
        this.consultarDados();
    }

    
    get nomeTipoBeneficiario (){
        return this.formulario.get('nomeBeneficario')
    }

    get getCampoTiposBeneficiario(){
        return this.formulario.get('tiposBeneficiario')
    }

    get getCampoPerfil(){
        return this.formulario.get('perfis')
    }

    private consultarDados(): void {
        if (this.beneficiarioPedidoParam) {
            this.removerValidacao()
            this.loadingScreen()
            this.beneficiarioPedidoService.consultarBeneficiarioPedido(this.beneficiarioPedidoParam).pipe(
                take<BeneficiarioPedido>(1)
            ).subscribe(beneficiarioPedido => {
                console.log("-------- consultarDados(): void { beneficiarioPedido");
                console.log(beneficiarioPedido);
                console.log(typeof beneficiarioPedido.dataInativacao);
                console.log("--------------------------------------" + Util.getDate(beneficiarioPedido.dataInativacao));
                this.beneficiarioPedido = beneficiarioPedido;
                this.formulario.patchValue( beneficiarioPedido )
                this.beneficiariosAssociados.setValue(null);
    
                this.dataInativacao.setValue(beneficiarioPedido.dataCadastramento);
                this.getCampoTiposBeneficiario.setValue( [{value: beneficiarioPedido.idTipoBeneficiario}] )
                this.inativo.setValue(this.beneficiarioPedido.inativo === 'SIM');
                this.consultarTiposDeBeneficiariosAssociados();
                this.consultarPerfis()
            });
           
        } else {
          
            this.consultarPerfis()
        }
    }

    dateToISO(d:any):string{
        const a = d.getFullYear();
        const m = String(d.getMonth()+1).padEnd(2,"0");
        const dia = String(d.getDate()).padStart(2, "0");
        return `${dia}-${m}-${a}`;
    }

    removerValidacao(){
        this.getCampoTiposBeneficiario.clearValidators()
        this.formulario.updateValueAndValidity()
    }
    private consultarTiposDeBeneficiariosAssociados(){
        this.loadingScreen()
        const dto: BeneficiarioPedido = {
            idsTipoProcesso: [this.beneficiarioPedidoParam.idTipoProcesso],
            somenteAtivos: this.beneficiarioPedidoParam ? true : false
        }
       
        this.beneficiarioPedidoService.consultarPorFiltro(dto)
        .pipe(
            take<BeneficiarioPedido[]>(1)
        ).subscribe(res => {
                this.listComboTipoBeneficiario = res.map(l => ({
                    label: `${l.inativo == 'NAO' ? 'Ativo' : 'Inativo' } - ${l.nomeTiposBeneficiario}`,
                    value: l.idTipoBeneficiario || '—',
                    descricao: null
                }));
                this.loadingScreen(false)
            });
    }

    private consultarTiposBeneficiario(): void {
        this.loadinTipoBeneficiario = true
        this.tipoBeneficiarioService.consultarTodosBeneficiariosAusentes(this.tipoProcesso.id).pipe(
            take<DadoComboDTO[]>(1)
        ).subscribe(res => {
            this.loadinTipoBeneficiario = false
            this.listComboTipoBeneficiario = res;
        }, err => this.messageService.addMsgDanger(err.error));
    }

    private consultarPerfis(): void {
        this.perfilMinimoService.consultarTodos().pipe(
            take<DadoComboDTO[]>(1)
        ).subscribe(res => {
            this.listComboPerfil = res;
            if( this.beneficiarioPedidoParam && this.beneficiarioPedidoParam.idPerfilMinimo){
                const idx = res.findIndex(p => p.value === this.beneficiarioPedidoParam.idPerfilMinimo)
                
                this.valuePerfil = [this.listComboPerfil[idx].value]
                this.getCampoPerfil.setValue( this.valuePerfil )      
            } 
        }, err => this.messageService.addMsgDanger(err.error));
    }

    public limparCampos(): void {
        this.formulario.reset();
        this.formulario.markAsPristine();
        this.formulario.markAsUntouched();
        this.formulario.updateValueAndValidity();
    }

    public restaurarCampos(): void {
        this.consultarDados();
    }

    public excluir(): void {
        this.messageService.addConfirmYesNo(this.bundle("MA021"), () => {
            this.loadingRM = true
            this.loadingScreen()
            
            
            const beneficiarioPedido: BeneficiarioPedido = {
                idTipoProcesso: this.beneficiarioPedidoParam.idTipoProcesso,
                idTipoBeneficiario: this.beneficiarioPedido.idTipoBeneficiario,
                idPerfilMinimo: this.beneficiarioPedidoParam.idPerfilMinimo
            }
            const queryParams = {
                tiposProcesso: [this.idTipoProcesso.value],
                descricaoTiposProcesso: [this.tipoProcesso.nome],
                somenteAtivos: !this.inativo.value
            }
            
            this.beneficiarioPedidoService.remover(beneficiarioPedido).subscribe(async () => {
                this.showSuccessMsg(this.bundle("MA039"));
                await this.router.navigate([this.rotaListar],{queryParams});
            }, err => {
                this.loadingRM = false
                this.loadingScreen(this.loadingRM)
                this.showDangerMsg(err.error)
            });
        });
    }

    public voltar(): void {
        this.location.back();
    }

    public salvar(): void {
        this.loading = true;
        this.loadingScreen()
        
        let beneficiarioPedido: BeneficiarioPedido = {
            idTipoProcesso: this.idTipoProcesso.value,
            tiposBeneficiario: this.getListaFormulario(this.getCampoTiposBeneficiario.value, this.listComboTipoBeneficiario, true, false),
            inativo: this.inativo.value ? 'SIM' : 'NAO',
            dataInativacao: this.dataInativacao.value,
            idsPerfilMinimo: this.getCampoPerfil.value
        };

        const queryParams = {
            tiposProcesso: [this.idTipoProcesso.value],
            descricaoTiposProcesso: [this.tipoProcesso.nome],
            somenteAtivos: !this.inativo.value
        }

        if (this.beneficiarioPedidoParam) {
          this.beneficiarioPedidoService.put(beneficiarioPedido).pipe(take(1)).subscribe(() => {
                this.showSuccessMsg(this.bundle("MA022"));

                this.router.navigate([this.rotaListar], { queryParams });
            }, err => {
                this.loading = false
                this.loadingScreen(this.loading)
                this.showDangerMsg(err.error)
            });
        } else {

          this.beneficiarioPedidoService.post(beneficiarioPedido).pipe(take<BeneficiarioPedido>(1)  
            ).subscribe(() => {
                this.showSuccessMsg(this.bundle("MA038"));
                this.router.navigate([this.rotaListar], {queryParams});
            }, err => {
                this.loading = false
                Loading.stop();
                this.showDangerMsg(err.error)
            });
        }
    }

    private getListaFormulario(formulario:any, combo: DadoComboDTO[], value:boolean, label:boolean):any{
        let retorno;
        if(formulario && formulario.length>0 && combo){
            const listaSelecionada = new Set(formulario.map(x=>Number(x)));
            retorno = combo.filter( item =>{ 
                return listaSelecionada.has(item?.value)
            });
            if(label){
                retorno = retorno.map(v => v.label); 
            }else if(value){
                retorno = retorno.map(v => v.value);
            }
        }else{
            retorno = null;
        };

        return retorno;
    }

    public onChangeInativo(event: CheckboxChangeEvent) {
        if (event.checked) {
            this.dataInativacao.setValue(new Date())
            this.dataInativacao.setValidators(Validators.required);
        } else {
            this.dataInativacao.clearValidators();
            this.dataInativacao.markAsPristine();
            this.dataInativacao.markAsUntouched();
            this.dataInativacao.updateValueAndValidity();
            if(this.beneficiarioPedido.dataInativacao){
                this.dataInativacao.setValue(this.beneficiarioPedido.dataInativacao);
            }else{
                this.dataInativacao.setValue(null);
            }    
        }
    }

    b64_to_utf8(str: string): string {
        return decodeURIComponent(
            atob(str).split('').map((c) => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join('')
        );
    }

    onChangeTipoProcesso(param: any){
        this.tipoProcesso = param
        if( param && !this.beneficiarioPedidoParam) this.consultarTiposBeneficiario()
    }

    isNull(data){
        return isNotUndefinedOrNull(data)
    }

    loadingScreen(loading = true){
        setTimeout(() => this.loadginBehavior.next(loading), 200);
    }

    atualizaLoading(){
        this.loadginBehavior
            .pipe(
                switchMap(p => of(p)),
                tap(p =>{
                    if(p) Loading.start();
                    else Loading.stop()
                })
            ).subscribe()
    }
}
