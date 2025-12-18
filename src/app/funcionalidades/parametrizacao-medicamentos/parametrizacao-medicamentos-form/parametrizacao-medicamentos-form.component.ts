import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {SelectItem} from "primeng/api";
import {Location} from "@angular/common";
import {take} from 'rxjs/operators';

import {AscValidators} from "../../../shared/validators/asc-validators";
import {BaseComponent} from "../../../shared/components/base.component";
import {MessageService} from "../../../shared/components/messages/message.service";
import {ComboService, MedicamentoService} from 'app/shared/services/services';
import {DadoComboDTO} from 'app/shared/models/dtos';
import {Util} from "../../../arquitetura/shared/util/util";
import {Medicamento} from 'app/shared/models/entidades';
import {SimNaoEnum} from "app/shared/models/comum/sim-nao";

import { CheckboxChangeEvent } from 'primeng/checkbox';
@Component({
    selector: 'asc-parametrizacao-medicamentos-form',
    templateUrl: './parametrizacao-medicamentos-form.component.html',
    styleUrls: ['./parametrizacao-medicamentos-form.component.scss']
})
export class ParametrizacaoMedicamentosFormComponent extends BaseComponent {

    medicamento:Medicamento;
    id: number;
    listComboLaboratorios: SelectItem[];

    idLaboratorio = this.formBuilder.control(null);
    coMedicamento = this.formBuilder.control(null);
    nome = this.formBuilder.control(null);
    codigoApresentacao = this.formBuilder.control(null);
    descricaoApresentacao = this.formBuilder.control(null);
    valor = this.formBuilder.control(null); 
    qtdFracionado = this.formBuilder.control(null); 
    valorFracionado = this.formBuilder.control(null); 
    percentualAliquota = this.formBuilder.control(null);
    codigoBarraAnvisa = this.formBuilder.control(null);
    numeroTiss = this.formBuilder.control(null); 
    numeroTuss = this.formBuilder.control(null);
    numeroUltimaEdicao = this.formBuilder.control(null);
    inativo = this.formBuilder.control(false);
    generico = this.formBuilder.control(false);
    dataInativacao = this.formBuilder.control(null, AscValidators.dataIgualAtualMaior);

    formulario: FormGroup = this.formBuilder.group({
        id: this.formBuilder.control(null),

        idLaboratorio: this.idLaboratorio,
        coMedicamento: this.coMedicamento,
        nome: this.nome,
        codigoApresentacao: this.codigoApresentacao,
        descricaoApresentacao: this.descricaoApresentacao,
        valor: this.valor,
        qtdFracionado: this.qtdFracionado,
        valorFracionado: this.valorFracionado,
        percentualAliquota: this.percentualAliquota,
        codigoBarraAnvisa: this.codigoBarraAnvisa,
        numeroTiss: this.numeroTiss,
        numeroTuss: this.numeroTuss,     
        numeroUltimaEdicao: this.numeroUltimaEdicao,
        generico: this.generico,
        inativo: this.inativo,
        dataInativacao: this.dataInativacao,
    });

    constructor(
        protected override messageService: MessageService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly comboService: ComboService,
        private readonly medicamentoService: MedicamentoService,
        private readonly formBuilder: FormBuilder,
        private readonly router: Router,
        private readonly location: Location
    ) {
        super(messageService);

    }

    ngOnInit(): void {
        
        this.id = this.activatedRoute.snapshot.params['id'];
        this.consultarEstadoInicialMedicamento();
        this.inicializarCombos();
    }

    public inicializarCombos(): void {
        this.comboService.consultarComboLaboratorios().pipe(
            take<DadoComboDTO[]>(1)
        ).subscribe(res => {
            this.listComboLaboratorios = res.map(d=>{return{label: d.label,value: d.value}} );     
        }, err => this.showDangerMsg(err.error));
    }

    public limitarTamanho(event:any, tamanho:number, nomeCampo:string){
        let valor = event.target.value;
        if(valor.length > tamanho){
            event.target.value = valor.slice(0,tamanho);
            this.formulario.get(nomeCampo).setValue(Number(event.target.value));
        }
    }

    private consultarEstadoInicialMedicamento(): void{

         if (this.id) {
            this.medicamentoService.consultarMedicamentoPorId(this.activatedRoute.snapshot.params["id"]).pipe(take(1)).subscribe(
                 (medicamento: Medicamento) => { 
                     if( medicamento ){
                        this.medicamento = medicamento;
                        this.medicamento.dataInativacao = Util.getDate(medicamento.dataInativacao);
                        
                        for (let key in this.medicamento) {
                            if (this.formulario.get(key) != undefined) {
                                this.formulario.get(key).setValue(this.medicamento[key]);
                            }
                        }

                        this.inativo.setValue(this.medicamento.inativo.toString() === "SIM");
                        this.generico.setValue(this.medicamento.generico.toString() === "SIM");
                     }else{
                         this.showDangerMsg('Cadastro não encontrado!')
                     }
             });
        }
    }

    limparCampos() {
        this.formulario.reset();
        this.formulario.markAsPristine();
        this.formulario.markAsUntouched();
        this.formulario.updateValueAndValidity();
    }

    public restaurarCampos(): void {
        this.consultarEstadoInicialMedicamento();
    }

    public salvar(): void {
        let medicamento = this.prepararFormulario();

        if (!this.medicamento || !this.medicamento.id) {  
            this.medicamentoService.post(medicamento).subscribe(async res => {
                this.medicamento = res;
                this.showSuccessMsg(this.bundle("MA038"));
                await this.router.navigate(['manutencao/parametros/gerenciar-medicamentos/buscar'],{
                    queryParams:{
                        id: res.id
                    }
                });
            }, err => this.showDangerMsg(err.error));
        } else {
                this.medicamentoService.put(medicamento).subscribe(async () => {
                    this.showSuccessMsg(this.bundle("MA022"));
                    await this.router.navigate(['manutencao/parametros/gerenciar-medicamentos/buscar'],{
                        queryParams:{
                            id: this.id
                    }
                });
            }, err => this.showDangerMsg(err.error));
        }
    }

    private prepararFormulario():any{
        let medicamento = this.formulario.value;

        medicamento.valor = medicamento.valor!==null? this.formatarTextoParaValor(medicamento.valor):null;
        medicamento.valorFracionado = medicamento.valorFracionado!==null? this.formatarTextoParaValor(medicamento.valorFracionado):null;
        medicamento.percentualAliquota = medicamento.percentualAliquota!==null? this.formatarTextoParaValor(medicamento.percentualAliquota):null;
        
        medicamento.numeroTiss = medicamento.numeroTiss!==null? Number(medicamento.numeroTiss):null;
        medicamento.numeroTuss = medicamento.numeroTuss!==null? Number(medicamento.numeroTuss):null;
        medicamento.numeroUltimaEdicao = medicamento.numeroUltimaEdicao!==null? Number(medicamento.numeroUltimaEdicao):null;
        medicamento.coMedicamento = medicamento.coMedicamento!==null? medicamento.coMedicamento:null;
        medicamento.generico = medicamento.generico===true? 'SIM':'NAO';
        medicamento.inativo = medicamento.inativo===true? 'SIM':'NAO';

        return medicamento;
    }

    private formatarTextoParaValor(numero:string):number{
        if(numero!==null && numero!==undefined){
            if(String(numero).includes(".") && !String(numero).includes(",")){
                return parseFloat(numero);
            }else{
                let ajustado = String(numero).replace(/\./g,'').replace(',','.');
                return parseFloat(ajustado);
            }
        }
        return null;
    }

    public excluir() {
        this.messageService.addConfirmYesNo(this.bundle("MA021"), () => {
            this.medicamentoService.delete(this.id).subscribe(async () => {
                    this.showSuccessMsg(this.bundle("MA039"));
                    await this.router.navigate(['manutencao/parametros/gerenciar-medicamentos/buscar']);
                }, err => {
                    //console.log(err);
                    this.showDangerMsg(err.error);
                }
            );
        });
    }

    public onChangeInativo(event: CheckboxChangeEvent) {
        if (event) {
            if(!this.dataInativacao.value){
                this.dataInativacao.setValue(new Date())
            }    
        }else{
            this.dataInativacao.clearValidators();
            this.dataInativacao.setValue(null);
            this.dataInativacao.markAsPristine();
            this.dataInativacao.markAsUntouched();
            this.dataInativacao.updateValueAndValidity(); 
        }
    }

    voltar(): void {
        this.location.back();
    }

    onPercentChange(){ 
        if(this.formulario.get('percentualAliquota').value){
            //console.log("this.percentualAliquota.value = "+this.formulario.get('percentualAliquota').value);
            let clean = this.formulario.get('percentualAliquota').value.replace(/\D/g, '');
            let num = parseFloat(clean) / 100;
            this.formulario.get('percentualAliquota').setValue( num.toLocaleString('pt-BR', {minimumFractionDigits:2, maximumFractionDigits:2}) );
        }

	}
}
