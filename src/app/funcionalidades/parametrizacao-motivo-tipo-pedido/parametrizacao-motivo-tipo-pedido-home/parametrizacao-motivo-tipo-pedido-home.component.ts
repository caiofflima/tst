import {Component, OnInit} from '@angular/core';
import {take} from "rxjs/operators";
import {Router} from "@angular/router";
import {Location} from "@angular/common";
import {SelectItem} from "primeng/api";
import {FormBuilder} from "@angular/forms";
import {DadoComboDTO} from "../../../shared/models/dto/dado-combo";
import {BaseComponent} from "../../../shared/components/base.component";
import {ComboService} from "../../../shared/services/comum/combo.service";
import {MessageService} from "../../../shared/components/messages/message.service";
import {TipoDeficienciaService} from '../../../shared/services/comum/tipo-deficiencia.service';
import {MotivoSolicitacaoService} from "../../../shared/services/comum/motivo-solicitacao.service";
import { Data } from "../../../shared/providers/data";
 
@Component({
    selector: 'asc-parametrizacao-motivo-tipo-pedido-home',
    templateUrl: './parametrizacao-motivo-tipo-pedido-home.component.html',
    styleUrls: ['./parametrizacao-motivo-tipo-pedido-home.component.scss']
})
export class ParametrizacaoMotivoTipoPedidoHomeComponent extends BaseComponent implements OnInit {

    sexos: SelectItem[];
    listComboEtadoCivil: DadoComboDTO[];
    listComboTipoProcesso: DadoComboDTO[];
    listComboTipoDocumento: DadoComboDTO[];
    listComboTipoBeneficiario: DadoComboDTO[];
    tipoDeficiencias: DadoComboDTO[];
    listaMotivoSolicitacao: DadoComboDTO[];

    formulario:any = this.formBuilder.group({
        sexo: [null],
        documentos: [null],
        obrigatorio: [null],
        estadoCivil: [null],
        somenteAtivos: [null],
        tiposProcesso: [null],
        tiposBeneficiario: [null],
        idMotivoSolicitacao: [null],
        idTipoDeficiencia: [null]
    });

    constructor(
        private readonly router: Router,
        private readonly location: Location,
        override readonly messageService: MessageService,
        private readonly formBuilder: FormBuilder,
        private readonly comboService: ComboService,
        private readonly tipoDeficienciaService: TipoDeficienciaService,
        private readonly motivoSolicitacaoService: MotivoSolicitacaoService,
        private readonly data:Data
    ) {
        super(messageService);
    }

    ngOnInit() {
        this.getSexo();
        this.inicializarCombos();
        this.getTipoDeficiencia();
        this.carregarDados();
    }

    private carregarDados():void{

        if (this.isStorageCarregado()) {
          const filtro = this.data.storage.dadosArmazenadosParamMotivo;
          setTimeout(() => {
            this.formulario.patchValue({
                somenteAtivos: filtro.somenteAtivos
            });
            this.preencherCamposSelecionadosPorCampo(filtro, "listaMotivoSolicitacao", "idMotivoSolicitacao");
            this.preencherCamposSelecionadosPorCampo(filtro, "sexos", "sexo");
            this.preencherCamposSelecionadosPorCampo(filtro, "tipoDeficiencias", "idTipoDeficiencia");
            this.preencherCamposSelecionadosPorCampo(filtro, "listComboTipoBeneficiario", "tiposBeneficiario");
            this.preencherCamposSelecionadosPorCampo(filtro, "listComboTipoProcesso", "tiposProcesso");

          }, 50);
        }
      }

    private isStorageCarregado(): boolean {
        return ((this.data.storage) && (this.data.storage.dadosArmazenadosParamMotivo));
    }

    private preencherCamposSelecionadosPorCampo(filtro:any, nomeCampo:any, nomeCampoFormulario:any):void{
        const lista = filtro[nomeCampoFormulario];
        if(!lista){
            return;
        }
        //const valores = lista.map(v => typeof v === 'object' ? v.value : v);
        
        setTimeout(() => {  this.formulario.get(nomeCampoFormulario)?.setValue(lista);}, 200);
        }

    public inicializarCombos(): void {
        this.carregarBeneficiarios();

        this.comboService.consultarComboTipoProcesso().pipe(
            take<DadoComboDTO[]>(1)
        ).subscribe(res => this.listComboTipoProcesso = res, err => this.showDangerMsg(err.error));

        this.comboService.consultarComboFinalidade().pipe(
            take<DadoComboDTO[]>(1)
        ).subscribe(res => this.listaMotivoSolicitacao = res, err => this.showDangerMsg(err.error));
    }

    private carregarBeneficiarios(){
        //-> Carrega todos
        this.comboService.consultarComboTipoBeneficiario().pipe(
            take<DadoComboDTO[]>(1)
        ).subscribe(res => this.listComboTipoBeneficiario = res, err => this.showDangerMsg(err.error));

        //-> Carrega de acordo com os tipos de processo
        // if (this.formulario.get('tiposProcesso').value) {
        //     this.comboService.consultarComboTipoBeneficiarioPorTipoProcesso([this.formulario.get('tiposProcesso').value]).pipe(
        //         take<DadoComboDTO[]>(1)
        //     ).subscribe(res => this.listComboTipoBeneficiario = res, err => this.showDangerMsg(err.error));
        // }
    }

    public onChangeProcesso(){
        this.formulario.get('tiposBeneficiario').reset();
        this.listComboTipoBeneficiario = [];
    
        this.carregarBeneficiarios();
    }

    public novo(): void {
        this.router.navigateByUrl('/manutencao/parametros/motivo-tipo-pedido/novo');
    }

    getTipoDeficiencia() {
        this.tipoDeficienciaService.consultarTodos().subscribe(
            result => {
                this.tipoDeficiencias =[];
                //this.tipoDeficiencias.push(new DadoComboDTO("Selecione", null, "Selecione"));
                result.forEach(item => this.tipoDeficiencias.push(new DadoComboDTO(item.descricao, item.codigo, item.descricao)));
            }
        );
    }	

    public getSexo(): void {
        this.sexos = [{
            value: 'M',
            label: "Masculino"
        }, {
            value: 'F',
            label: "Feminino"
        }];
    }

    public pesquisar(): void {
        this.limparStorage();
        let dadosArmazenadosParamMotivo = this.prepararDados();
        this.salvarStorage(dadosArmazenadosParamMotivo);

        this.router.navigate(['/manutencao/parametros/motivo-tipo-pedido/buscar'], {
            queryParams: { ...dadosArmazenadosParamMotivo }
        }).then();
    }

    prepararDados():any{
        const idMotivoSolicitacao = this.getListaFormulario(this.formulario.get('idMotivoSolicitacao').value, this.listaMotivoSolicitacao, true, false);
        const sexo = this.getListaFormulario(this.formulario.get('sexo').value, this.sexos, true, false);
        const idTipoDeficiencia = this.getListaFormulario(this.formulario.get('idTipoDeficiencia').value, this.tipoDeficiencias, true, false);
        const tiposBeneficiario = this.getListaFormulario(this.formulario.get('tiposBeneficiario').value, this.listComboTipoBeneficiario, true, false);
        const tiposProcesso = this.getListaFormulario(this.formulario.get('tiposProcesso').value, this.listComboTipoProcesso, true, false);

        const descricaoMotivoSolicitacao = this.getListaFormulario(this.formulario.get('idMotivoSolicitacao').value, this.listaMotivoSolicitacao, false, true);
        const descricaoSexo = this.getListaFormulario(this.formulario.get('sexo').value, this.sexos, false, true);
        const descricaoTipoDeficiencia = this.getListaFormulario(this.formulario.get('idTipoDeficiencia').value, this.tipoDeficiencias, false, true);
        const descricaoTiposBeneficiario = this.getListaFormulario(this.formulario.get('tiposBeneficiario').value, this.listComboTipoBeneficiario, false, true);
        const descricaoTiposProcesso = this.getListaFormulario(this.formulario.get('tiposProcesso').value, this.listComboTipoProcesso, false, true);

        return {
            tiposProcesso,
            idMotivoSolicitacao,
            tiposBeneficiario,
            sexo,
            idTipoDeficiencia,
            somenteAtivos: this.formulario.get('somenteAtivos').value,
            descricaoSexo,
            descricaoMotivoSolicitacao,
            descricaoTipoDeficiencia,
            descricaoTiposProcesso,
            descricaoTiposBeneficiario
        }
    }

    private getListaFormulario(formulario:any, combo: any[], value:boolean, label:boolean):any{
        let retorno;
        if(formulario && formulario.length>0 && combo){
            const listaSelecionada = new Set(formulario.map(x=>isNaN(Number(x))?String(x):Number(x)));
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

    salvarStorage(dadosArmazenadosParamMotivo:any):void{
        this.data.storage = { dadosArmazenadosParamMotivo };
    }

    limparStorage(){
        this.data.storage = {};
    }

    public limparCampos(): void {
        this.limparStorage();
        this.formulario.reset();
        this.formulario.markAsPristine();
        this.formulario.markAsUntouched();
        this.formulario.updateValueAndValidity();
    }

    public voltar(): void {
        this.location.back();
    }

}
