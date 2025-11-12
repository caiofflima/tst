import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {take} from "rxjs/operators";
import {ActivatedRoute, Router} from "@angular/router";
import {SelectItem} from "primeng/api";
import {Location} from "@angular/common";

import {TipoDeficienciaService} from "../../../shared/services/comum/tipo-deficiencia.service";
import {MessageService} from "../../../shared/components/messages/message.service";
import {BaseComponent} from "../../../shared/components/base.component";
import {AscValidators} from "../../../shared/validators/asc-validators";
import {DadoComboDTO} from "../../../shared/models/dto/dado-combo";
import {ComboService} from "../../../shared/services/comum/combo.service";
import {SessaoService} from 'app/shared/services/services';
import {Util} from "../../../arquitetura/shared/util/util";
import {MotivoSolicitacaoTipoPedidoService} from "../../../shared/services/comum/motivo-solicitacao-tipo-pedido.service";
import {MotivoSolicitacaoTipoPedidoDTO} from 'app/shared/models/dto/motivo-solicitacao-tipo-pedido';
import {MotivoSolicitacaoTipoPedidoIncluirDTO} from 'app/shared/models/dto/motivo-solicitacao-tipo-pedido-incluir';
import {MotivoSolicitacaoTipoPedidoBeneficiariosDTO} from 'app/shared/models/dto/motivo-solicitacao-tipo-pedido-beneficiarios';

@Component({
    selector: 'asc-parametrizacao-motivo-tipo-pedido-form',
    templateUrl: './parametrizacao-motivo-tipo-pedido-form.component.html',
    styleUrls: ['./parametrizacao-motivo-tipo-pedido-form.component.scss']
})
export class ParametrizacaoMotivoTipoPedidoFormComponent extends BaseComponent {

    sexos: SelectItem[] = [{
        label: 'Selecione uma opção',
        value: null
    }, {
        label: 'Masculino',
        value: 'M'
    }, {
        label: 'Feminino',
        value: 'F'
    }];

    id: number;
    idTipoProcesso: number;
    tipoDeficiencias: SelectItem[];
    listComboTipoBeneficiario: SelectItem[];

    idTipoDeficiencia = this.formBuilder.control(null);
    idMotivoSolicitacao = this.formBuilder.control(null);
    idDocumento = this.formBuilder.control(null, [Validators.required]);
    tiposProcesso = this.formBuilder.control(null, [Validators.required]);
    tiposBeneficiario = this.formBuilder.control(null, [Validators.required]);

    sexo = this.formBuilder.control(null);
    inativo = this.formBuilder.control(false);
    idadeMinima = this.formBuilder.control(null);
    idadeMaxima = this.formBuilder.control(null);
    dataCadastramento = this.formBuilder.control(null);
    codigoUsuarioCadastramento = this.formBuilder.control(null);
    dataInativacao = this.formBuilder.control(null, AscValidators.dataIgualAtualMaior);
    requiredMsg: string; 
    motivoSolicitacaoTipoPedidoDTO: MotivoSolicitacaoTipoPedidoDTO;
    motivoSolicitacaoTipoPedidoIncluirDTO: MotivoSolicitacaoTipoPedidoIncluirDTO;
    motivoSolicitacaoTipoPedidoBeneficiariosDTO: MotivoSolicitacaoTipoPedidoBeneficiariosDTO = null;
    isEdicao:boolean = false;
    tiposBeneficiariosSelecionados:SelectItem[];

    constructor(
        override readonly messageService: MessageService,
        private readonly router: Router,
        private readonly location: Location,
        private readonly route: ActivatedRoute,
        private readonly formBuilder: FormBuilder,
        private readonly comboService: ComboService,
        private readonly serviceTipoDeficiencia: TipoDeficienciaService,
        private readonly serviceMotivoSolicitacaoTipoPedido: MotivoSolicitacaoTipoPedidoService
    ) {
        super(messageService);
        //this.id = this.route.snapshot.params.id; // mudou para um objeto

    }

    ngOnInit(): void {
        this.motivoSolicitacaoTipoPedidoBeneficiariosDTO = JSON.parse(localStorage.getItem('motivoSolicitacaoTipoPedidoBeneficiariosDTO')) ;
        console.log(this.motivoSolicitacaoTipoPedidoBeneficiariosDTO);
        if(this.motivoSolicitacaoTipoPedidoBeneficiariosDTO !== null && this.motivoSolicitacaoTipoPedidoBeneficiariosDTO !== undefined){
            this.isEdicao = true;
        }
        
        this.retornaListaTipoDeficiencia();
        this.consultarEstadoInicial();
        this.requiredMsg = this.bundle('MA007');
        //console.log("this.montarLista(); -------------------------");
        //this.montarLista();
    }

    public carregaBeneficiarios(): void {
        if (this.tiposProcesso.value) {
            this.comboService.consultarComboTipoBeneficiarioPorTipoProcesso([this.tiposProcesso.value]).pipe(
                take<DadoComboDTO[]>(1)
            ).subscribe(res => this.listComboTipoBeneficiario = res, err => this.showDangerMsg(err.error));
        }
    }

    public onChangeProcesso(): void {
        this.tiposBeneficiario.reset();
        this.listComboTipoBeneficiario = [];

        this.carregaBeneficiarios();
    }

    private consultarEstadoInicial(): void {
        this.carregarFormDados();
        this.iniciarDadosParaAtualizacao();
    }

    carregarFormDados():void{
        if(this.motivoSolicitacaoTipoPedidoBeneficiariosDTO){ 
            this.motivoSolicitacaoTipoPedidoDTO = this.motivoSolicitacaoTipoPedidoBeneficiariosDTO;
            this.motivoSolicitacaoTipoPedidoDTO.dataInativacao = Util.getDate(this.motivoSolicitacaoTipoPedidoBeneficiariosDTO.dataInativacao);
           
            for (let key in this.motivoSolicitacaoTipoPedidoBeneficiariosDTO) {
                if (this.formulario.get(key) != undefined) {
                    this.formulario.get(key).setValue(this.motivoSolicitacaoTipoPedidoBeneficiariosDTO[key]);
                }
            }

            this.motivoSolicitacaoTipoPedidoBeneficiariosDTOToForm();

            //Algumas vezes não carrega a combobox de beneficiarios, esta parte força a carga.
            if(!this.listComboTipoBeneficiario || this.listComboTipoBeneficiario.length === 0)
            {
                this.carregaBeneficiarios();
            }
        }
    }

    motivoSolicitacaoTipoPedidoBeneficiariosDTOToForm():void{
            this.idMotivoSolicitacao.setValue(this.motivoSolicitacaoTipoPedidoBeneficiariosDTO.idMotivoSolicitacao);  
            this.inativo.setValue(this.motivoSolicitacaoTipoPedidoBeneficiariosDTO.inativo === 'SIM');
            this.sexo.setValue(this.getSiglaSexo(this.motivoSolicitacaoTipoPedidoBeneficiariosDTO.sexo));
            this.idTipoDeficiencia.setValue(this.motivoSolicitacaoTipoPedidoBeneficiariosDTO.tipoDeficiencia);     
            this.tiposProcesso.setValue(this.motivoSolicitacaoTipoPedidoBeneficiariosDTO.idTipoProcesso);
            this.tiposBeneficiario.setValue(this.motivoSolicitacaoTipoPedidoBeneficiariosDTO.idsTipoBeneficiario.map(x => Number(x)));
          
    }

    iniciarDadosParaAtualizacao():void{
         if (this.id !== null && this.id !== undefined) {
            
             this.serviceMotivoSolicitacaoTipoPedido.consultarPorId(this.id).pipe(
                 take<MotivoSolicitacaoTipoPedidoDTO>(1)
             ).subscribe(motivoSolicitacaoTipoPedidoDTO => {
                //console.log(motivoSolicitacaoTipoPedidoDTO)
                 this.motivoSolicitacaoTipoPedidoDTO = motivoSolicitacaoTipoPedidoDTO;
                 this.motivoSolicitacaoTipoPedidoDTO.dataInativacao = Util.getDate(motivoSolicitacaoTipoPedidoDTO.dataInativacao);
                
                 for (let key in this.motivoSolicitacaoTipoPedidoDTO) {
                    if (this.formulario.get(key) != undefined) {
                        this.formulario.get(key).setValue(this.motivoSolicitacaoTipoPedidoDTO[key]);
                    }
                }

                this.inativo.setValue(this.motivoSolicitacaoTipoPedidoDTO.inativo === 'SIM');
                this.idTipoDeficiencia.setValue(this.motivoSolicitacaoTipoPedidoDTO.tipoDeficiencia);
                this.sexo.setValue(this.getSiglaSexo(this.motivoSolicitacaoTipoPedidoDTO.sexo));
                this.tiposProcesso.setValue(this.motivoSolicitacaoTipoPedidoDTO.idTipoProcesso);
                let idsBeneficiarios = [];
                idsBeneficiarios.push(this.motivoSolicitacaoTipoPedidoDTO.idTipoBeneficiario)
                this.tiposBeneficiario.setValue(idsBeneficiarios.map(x => Number(x)));
                 
                //Algumas vezes não carrega a combobox de beneficiarios, esta parte força a carga.
                if(!this.listComboTipoBeneficiario || this.listComboTipoBeneficiario.length === 0)
                {
                    this.carregaBeneficiarios();
                }
             });
         }
    }



    formulario: FormGroup = this.formBuilder.group({
        sexo: this.sexo,
        inativo: this.inativo,
        idadeMaxima: this.idadeMaxima,
        idadeMinima: this.idadeMinima,
        tiposProcesso: this.tiposProcesso,
        dataInativacao: this.dataInativacao,
        idTipoDeficiencia: this.idTipoDeficiencia,
        dataCadastramento: this.dataCadastramento,
        tiposBeneficiario: this.tiposBeneficiario,
        idMotivoSolicitacao: this.idMotivoSolicitacao
    });

    public retornaListaTipoDeficiencia() {
        this.serviceTipoDeficiencia.consultarTodos().subscribe(result => {
            this.tipoDeficiencias = result.map(item => ({
                label: item.descricao,
                value: item.id
            }));
        });
    }


    public salvar(): void {
         //if (this.id) {
        if (this.motivoSolicitacaoTipoPedidoBeneficiariosDTO) {
            this.alterar();
         } else {
            this.cadastrar();
         }
    }

    private alterar():void{
        const motivoSolicitacaoTipoPedidoDTO: MotivoSolicitacaoTipoPedidoDTO={} as MotivoSolicitacaoTipoPedidoDTO;// = this.formulario.value;
        motivoSolicitacaoTipoPedidoDTO.idTipoProcesso = this.tiposProcesso.value;
        motivoSolicitacaoTipoPedidoDTO.coUsuarioCadastramento = SessaoService.usuario.matriculaFuncional;
        motivoSolicitacaoTipoPedidoDTO.idTipoBeneficiario = this.getTipoBeneficiarioFromList(this.tiposBeneficiario.value);
        motivoSolicitacaoTipoPedidoDTO.idMotivoSolicitacao = this.idMotivoSolicitacao.value;
        motivoSolicitacaoTipoPedidoDTO.tipoDeficiencia = this.idTipoDeficiencia.value;
        motivoSolicitacaoTipoPedidoDTO.dataInativacao = Util.getDate(this.dataInativacao.value);
        motivoSolicitacaoTipoPedidoDTO.idadeMaxima = this.idadeMaxima.value;
        motivoSolicitacaoTipoPedidoDTO.idadeMinima = this.idadeMinima.value;
        motivoSolicitacaoTipoPedidoDTO.inativo = this.getSimNao(this.inativo.value);
        motivoSolicitacaoTipoPedidoDTO.sexo = this.getSexo(this.sexo.value);
        //motivoSolicitacaoTipoPedidoDTO.parentesco = 0;
        motivoSolicitacaoTipoPedidoDTO.id = this.id;
        //console.log(motivoSolicitacaoTipoPedidoDTO);

        if (this.motivoSolicitacaoTipoPedidoBeneficiariosDTO.idsMotivoTipoBeneficiario !== null) {
            motivoSolicitacaoTipoPedidoDTO.idsMotivoTipoBeneficiario = this.motivoSolicitacaoTipoPedidoBeneficiariosDTO.idsMotivoTipoBeneficiario;
            this.serviceMotivoSolicitacaoTipoPedido.alterarLista(motivoSolicitacaoTipoPedidoDTO).pipe(
                take<MotivoSolicitacaoTipoPedidoDTO>(1)).subscribe(res => {
                this.showSuccessMsg(this.bundle("MA022"));
                this.router.navigate(['manutencao/parametros/motivo-tipo-pedido/buscar']);
            }, err => this.showDangerMsg(err.error));
        }else{
            this.serviceMotivoSolicitacaoTipoPedido.put(motivoSolicitacaoTipoPedidoDTO).pipe(
                take<MotivoSolicitacaoTipoPedidoDTO>(1)).subscribe(res => {
                this.showSuccessMsg(this.bundle("MA022"));
                this.router.navigate(['manutencao/parametros/motivo-tipo-pedido/buscar'], {
                    queryParams: {
                        id: this.id,
                        isRetorno: true
                    }
                });
            }, err => this.showDangerMsg(err.error));
        }

    }

    getTipoBeneficiarioFromList(list:any){
        if(list!==null){
            return list[0];
        }
        return null;
    }

    private cadastrar():void{
        const motivoSolicitacaoTipoPedidoIncluirDTO: MotivoSolicitacaoTipoPedidoIncluirDTO={} as MotivoSolicitacaoTipoPedidoIncluirDTO//this.formulario.value;
        motivoSolicitacaoTipoPedidoIncluirDTO.idTipoProcesso = this.tiposProcesso.value;
        motivoSolicitacaoTipoPedidoIncluirDTO.coUsuarioCadastramento = SessaoService.usuario.matriculaFuncional;
        motivoSolicitacaoTipoPedidoIncluirDTO.idsTipoBeneficiario = this.tiposBeneficiario.value;
        motivoSolicitacaoTipoPedidoIncluirDTO.idMotivoSolicitacao = this.idMotivoSolicitacao.value;
        motivoSolicitacaoTipoPedidoIncluirDTO.tipoDeficiencia = this.idTipoDeficiencia.value;
        motivoSolicitacaoTipoPedidoIncluirDTO.dataInativacao = Util.getDate(this.dataInativacao.value);
        motivoSolicitacaoTipoPedidoIncluirDTO.idadeMaxima = this.idadeMaxima.value;
        motivoSolicitacaoTipoPedidoIncluirDTO.idadeMinima = this.idadeMinima.value;
        motivoSolicitacaoTipoPedidoIncluirDTO.inativo = (this.inativo.value)?this.getSimNao(this.inativo.value):"NAO";
        motivoSolicitacaoTipoPedidoIncluirDTO.sexo = this.getSexo(this.sexo.value);
        //motivoSolicitacaoTipoPedidoDTO.parentesco = 0;
        console.log(motivoSolicitacaoTipoPedidoIncluirDTO);
        this.serviceMotivoSolicitacaoTipoPedido.post(motivoSolicitacaoTipoPedidoIncluirDTO).pipe(
            take<MotivoSolicitacaoTipoPedidoDTO>(1)).subscribe(res => {
            this.showSuccessMsg(this.bundle("MA038"));

            if(res && res.id){
                this.router.navigate(['manutencao/parametros/motivo-tipo-pedido/buscar'], {
                    queryParams: {
                        id: res.id,
                        isRetorno: true
                    }
                });
            }else{
                this.router.navigate(['manutencao/parametros/motivo-tipo-pedido/buscar']);
            }

        }, err => this.showDangerMsg(err.error));
    }

    private getSiglaSexo(sexo:string):string{
        let retorno = "";
        if(sexo !== null && sexo.length>0){
            if(sexo.toLowerCase() === 'masculino'){
                retorno = "M";
            } else retorno = "F";
        }

        return retorno;
    }

    getSimNao(condicao:boolean):string{
        if(condicao !== null){
            if(condicao){
                return 'SIM';
            } else return 'NAO';
        }
        return "";
    }

    getSexo(sexo:string):string{
        if(sexo !== null && sexo.length>0){
            if(sexo.toUpperCase() ==='M' || sexo.toUpperCase() ==='MASCULINO'){
                return 'MASCULINO';
            } else return 'FEMININO';
        }
        return null;
    }

    public onChangeInativo(inativo: boolean): void {
        if (inativo) {
            this.dataInativacao.setValue(new Date())
        } else {
            this.dataInativacao.reset();
        }
    }

    public montarLista(): SelectItem[] {
        let idsSelecionados: SelectItem[]=[];
  
        //let textoId:string[] = this.motivoSolicitacaoTipoPedidoBeneficiariosDTO.tiposBeneficiario.split(",");
        this.motivoSolicitacaoTipoPedidoBeneficiariosDTO.idsTipoBeneficiario.map((id, index) => {
            idsSelecionados.push({
                value: id,
                label: this.motivoSolicitacaoTipoPedidoBeneficiariosDTO.tiposBeneficiario[index]
            })
        });
        //console.log(idsSelecionados);
        return idsSelecionados;
    }

    public restaurarCampos(): void {
        this.consultarEstadoInicial();
    }

    public limparCampos(): void {
        this.formulario.reset();
        this.formulario.markAsPristine();
        this.formulario.markAsUntouched();
        this.formulario.updateValueAndValidity();
    }

    public excluir(): void {
        this.messageService.addConfirmYesNo(this.bundle("MA021"), () => {
            this.serviceMotivoSolicitacaoTipoPedido.delete(this.id).pipe(take(1)).subscribe(async () => {
                    this.showSuccessMsg(this.bundle("MA039"));
                    await this.router.navigate(['manutencao/parametros/motivo-tipo-pedido/buscar']);
                }, err => this.showDangerMsg(err.error)
            );
        });
    }

    public excluirLista(): void {
        this.messageService.addConfirmYesNo(this.bundle("MA021"), () => {
            this.serviceMotivoSolicitacaoTipoPedido.excluirLista(this.motivoSolicitacaoTipoPedidoBeneficiariosDTO.idsMotivoTipoBeneficiario).pipe(take(1)).subscribe(async () => {
                    this.showSuccessMsg(this.bundle("MA039"));
                    await this.router.navigate(['manutencao/parametros/motivo-tipo-pedido/buscar']);
                }, err => this.showDangerMsg(err.error)
            );
        });
    }

    public voltar(): void {
        this.location.back();
    }

    public validaForm(): boolean {
        let retorno = true;

        if(!this.tiposProcesso.value || !this.tiposBeneficiario.value || !this.idMotivoSolicitacao.value)
            retorno = false;

        return retorno;
    }
}
