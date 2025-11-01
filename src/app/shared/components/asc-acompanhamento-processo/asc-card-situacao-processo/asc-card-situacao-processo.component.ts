import {Component, Input, OnInit} from '@angular/core';
import {Pedido} from "../../../models/comum/pedido";
import {ProgressoDTO} from "../../../models/dto/progresso";
import {fadeAnimation} from "../../../animations/faded.animation";
import {AscComponenteAutorizado} from "../../asc-pedido/asc-componente-autorizado";
import * as $ from 'jquery';
import { PrazoTratamentoService } from 'app/shared/services/comum/prazo-tratamento.service';
import { StatusProcessoEnum } from 'app/arquitetura/shared/enums/status-processo.enum';
import { AcaoRequeridaAgenteEnum } from 'app/arquitetura/shared/enums/acaoRequeridaAgente.enum';

@Component({
    selector: 'asc-card-situacao-processo',
    templateUrl: './asc-card-situacao-processo.component.html',
    styleUrls: ['./asc-card-situacao-processo.component.scss'],
    animations: [fadeAnimation]
})
export class AscCardSituacaoProcessoComponent extends AscComponenteAutorizado {

    porcentagem = 0;
    progresso: ProgressoDTO = new ProgressoDTO();
    isConclusivo: boolean = false;

    mensagemProcesso: string = null;

    iconExclamation = null;
    iconCheck = null;
    iconCircle = null;
    iconTimes = null;
    iconHourglass = null;
    iconSearch = null;

    constructor(
        private readonly prazoTratamentoService: PrazoTratamentoService
    ) {
        super();
    }

    ngOnInit() {
        this.iconExclamation = document.getElementById('iconExclamation');
        this.iconCheck = document.getElementById('iconCheck');
        this.iconCircle = document.getElementById('iconCircle');
        this.iconTimes = document.getElementById('iconTimes');
        this.iconHourglass = document.getElementById('iconHourglass');
        this.iconSearch = document.getElementById('iconSearch');
    }

    limparIcon(){  
        this.iconExclamation.style.display = 'none';
        this.iconCheck.style.display = 'none';
        this.iconCircle.style.display = 'none';
        this.iconTimes.style.display = 'none';
        this.iconHourglass.style.display = 'none';
        this.iconSearch.style.display = 'none';
    }

    _processoPedido: Pedido;

    @Input() set processoPedido(processoPedido: Pedido) {
        this._processoPedido = processoPedido;
        if (processoPedido && processoPedido.id) {
            this.prazoTratamentoService.consultarProgressoPrazoPorPedido(processoPedido.id).subscribe((progresso: ProgressoDTO) => {
                this.porcentagem = 0;
                this._tipoDias = null;
                this.progresso = progresso;
                
                /* if(this.progresso.diasPrazo==99){
                    this.progresso.diasPrazo = null;
                } */

                if (this._processoPedido && this._processoPedido.ultimaSituacao && this._processoPedido.ultimaSituacao.situacaoProcesso.conclusivo === 'SIM'){
                    this.isConclusivo = true;
                    this.porcentagem = 100;
                }

                this.configurarTipoDias(progresso);
                if (!this.isConclusivo) {

                    this.calcularPercentualDias(progresso);
                }
                this.configurarMensagemProcesso();
                this.defineIcone();
            });
        }
    }

    private _tipoDias: string;

    get tipoDias(): string {
        return this._tipoDias;
    }

    defineColor() {    
        if (this.progresso && this.progresso.diasAtraso > 0 && !this.isConclusivo) {
            return '#FF0000';
        } else {
            return this.defineColorBD();
        }    
    }

    defineColorBD() {
        if (this._processoPedido && this._processoPedido.ultimaSituacao){
            return this._processoPedido.ultimaSituacao.situacaoProcesso.coCor;
        }    
    }

    defineIcone(): string {

        this.limparIcon();  

        // Ajusta as dimensões e posições
        if (this.isConclusivo || this._processoPedido.ultimaSituacao.situacaoProcesso.id === StatusProcessoEnum.CADASTRADO_SISTEMA_SAUDE) {
            $('.ellipse-container').css('width', '120px');
            $('.ellipse-container').css('height', '120px');
            this.iconExclamation.style.right = '0%';
            this.iconCheck.style.right = '0%';
            this.iconTimes.style.right = '0%';
        }

        // Resetar a visibilidade dos ícones
        this.iconExclamation.style.display = 'none';
        this.iconCheck.style.display = 'none';
        this.iconTimes.style.display = 'none';
        this.iconCircle.style.display = 'none';
        this.iconSearch.style.display = 'none';
        this.iconHourglass.style.display = 'none';

        // Lógica para exibir ícones com base nas condições
        if (this._processoPedido.ultimaSituacao.situacaoProcesso.id === StatusProcessoEnum.CADASTRADO_SISTEMA_SAUDE) {
            this.iconCheck.style.display = 'block'; // Mostrar ícone de check
        } else if (this._processoPedido.ultimaSituacao.situacaoProcesso.negativo === 'NAO' &&
            this._processoPedido.ultimaSituacao.situacaoProcesso.conclusivo === 'SIM') {
            this.iconCheck.style.display = 'block'; // Mostrar ícone de check
        } else if (this._processoPedido.ultimaSituacao.situacaoProcesso.negativo === 'SIM') {
            this.iconTimes.style.display = 'block'; // Mostrar ícone de times/X-negativo
        } else if (this.progresso && this.progresso.diasAtraso && this.progresso.diasAtraso > 0) {
            this.iconExclamation.style.display = 'block'; // Mostrar ícone de exclamação
        } else if (this._processoPedido.ultimaSituacao.situacaoProcesso.nuAcaoRequeridaAgente === AcaoRequeridaAgenteEnum.SOLICITANTE) {
            this.iconCircle.style.display = 'block'; // Mostrar ícone de círculo
        } else if (this._processoPedido.ultimaSituacao.situacaoProcesso.nuAcaoRequeridaAgente === AcaoRequeridaAgenteEnum.ANALISTA) {
            this.iconSearch.style.display = 'block'; // Mostrar ícone de pesquisa
        } else if (this._processoPedido.ultimaSituacao.situacaoProcesso.nuAcaoRequeridaAgente === AcaoRequeridaAgenteEnum.AUDITORIA_DE_SAUDE) {
            this.iconExclamation.style.display = 'block'; // Mostrar ícone de exclamação
        } else if (this._processoPedido.ultimaSituacao.situacaoProcesso.nuAcaoRequeridaAgente === AcaoRequeridaAgenteEnum.SISTEMA) {
            this.iconHourglass.style.display = 'block'; // Mostrar ícone de ampulheta
        }

        //alert(this._processoPedido.ultimaSituacao.situacaoProcesso.nuAcaoRequeridaAgente)
        //else if (this._processoPedido.ultimaSituacao.situacaoProcesso.id === StatusProcessoEnum.RECEBENDO_DOCUMENTACAO_TITULAR ||
        //     this._processoPedido.ultimaSituacao.situacaoProcesso.id === StatusProcessoEnum.AGUARD_DOC_COMPLEMENTAR ||
        //     this._processoPedido.ultimaSituacao.situacaoProcesso.id === StatusProcessoEnum.REVISAO_REQUERIDA_PELO_TITULAR) {
        //     this.iconCircle.style.display = 'block';
        // } else if (this._processoPedido.ultimaSituacao.situacaoProcesso.id === StatusProcessoEnum.PROCESSO_CRIADO ||
        //     this._processoPedido.ultimaSituacao.situacaoProcesso.id === StatusProcessoEnum.SOB_ANALISE_MEDICO ||
        //     this._processoPedido.ultimaSituacao.situacaoProcesso.id === StatusProcessoEnum.SOB_ANALISE_DENTISTA ||
        //     this._processoPedido.ultimaSituacao.situacaoProcesso.id === StatusProcessoEnum.SOB_ANALISE_ENFERMEIRO ||
        //     this._processoPedido.ultimaSituacao.situacaoProcesso.id === StatusProcessoEnum.SOB_ANALISE_PSICOLOGO ||
        //     this._processoPedido.ultimaSituacao.situacaoProcesso.id === StatusProcessoEnum.SOB_ANALISE_FONOAUDIOLOGO ||
        //     this._processoPedido.ultimaSituacao.situacaoProcesso.id === StatusProcessoEnum.SOB_ANALISE_FISIOTERAPEUTA ||
        //     this._processoPedido.ultimaSituacao.situacaoProcesso.id === StatusProcessoEnum.SOB_ANALISE_EQUIPE_TEC_ADMINISTRATIVA ||
        //     this._processoPedido.ultimaSituacao.situacaoProcesso.id === StatusProcessoEnum.SOB_ANALISE_PROFISSIONAL_CAIXA ||
        //     this._processoPedido.ultimaSituacao.situacaoProcesso.id === StatusProcessoEnum.AGUARDANDO_COTACAO_OPME ||
        //     this._processoPedido.ultimaSituacao.situacaoProcesso.id === StatusProcessoEnum.AGUARD_CONS_PROFISSIONAL ||
        //     this._processoPedido.ultimaSituacao.situacaoProcesso.id === StatusProcessoEnum.AGUARD_MANIF_PROFISSIONAL_ASSIT ||
        //     this._processoPedido.ultimaSituacao.situacaoProcesso.id === StatusProcessoEnum.AGUARD_MANIF_PROFISSIONAL_DESMP ||
        //     this._processoPedido.ultimaSituacao.situacaoProcesso.id === StatusProcessoEnum.BENEF_CONV_PERICIA ||
        //     this._processoPedido.ultimaSituacao.situacaoProcesso.id === StatusProcessoEnum.AGUARD_PERICIA_PRESENCIAL ||
        //     this._processoPedido.ultimaSituacao.situacaoProcesso.id === StatusProcessoEnum.AGUARD_RESULTADO_EXAMES ||
        //     this._processoPedido.ultimaSituacao.situacaoProcesso.id === StatusProcessoEnum.AGUARD_PARECER_DESEMPATADOR ||
        //     this._processoPedido.ultimaSituacao.situacaoProcesso.id === StatusProcessoEnum.AGUARD_DECISAO_ADM_FILIAL ||
        //     this._processoPedido.ultimaSituacao.situacaoProcesso.id === StatusProcessoEnum.AGUARD_DECISAO_ADM_MATRIZ ||
        //     this._processoPedido.ultimaSituacao.situacaoProcesso.id === StatusProcessoEnum.SOB_AUDITORIA_INTERNA ||
        //     this._processoPedido.ultimaSituacao.situacaoProcesso.id === StatusProcessoEnum.AGUARD_CAD_PROFISSIONAL_LIVRE) {
        //     this.iconSearch.style.display = 'block';
        // } else if (this._processoPedido.ultimaSituacao.situacaoProcesso.id === StatusProcessoEnum.PEDIDO_DEFERIDO ||
        //     this._processoPedido.ultimaSituacao.situacaoProcesso.id === StatusProcessoEnum.PEDIDO_DEFERIDO_AUTOMATICAMENTE ||
        //     this._processoPedido.ultimaSituacao.situacaoProcesso.id === StatusProcessoEnum.AUTORIZACAO_PREVIA ||
        //     this._processoPedido.ultimaSituacao.situacaoProcesso.id === StatusProcessoEnum.AUTORIZACAO_PREVIA_LIB_PARC ||
        //     this._processoPedido.ultimaSituacao.situacaoProcesso.id === StatusProcessoEnum.MIGRAR_SIST_SAUDE ||
        //     this._processoPedido.ultimaSituacao.situacaoProcesso.id === StatusProcessoEnum.EM_PROCESSAMENTO_SIST_SAUDE ||
        //     this._processoPedido.ultimaSituacao.situacaoProcesso.id === StatusProcessoEnum.FALHA_PROC_SIST_SAUDE ||
        //     this._processoPedido.ultimaSituacao.situacaoProcesso.id === StatusProcessoEnum.EM_CONFERENCIA_SIST_SAUDE) {
        //     this.iconHourglass.style.display = 'block';
        // } else if (this._processoPedido.ultimaSituacao.situacaoProcesso.id === StatusProcessoEnum.SOLICITADO_PARECER_COMPLEMENTAR_AUDITORIA ||
        //     this._processoPedido.ultimaSituacao.situacaoProcesso.id === StatusProcessoEnum.SOLIC_FINALIZ_OP_AUDITORIA_LIBERACAO ||
        //     this._processoPedido.ultimaSituacao.situacaoProcesso.id === StatusProcessoEnum.SOLIC_FINALIZ_OP_AUDITORIA_LIBERACAO_PARC ||
        //     this._processoPedido.ultimaSituacao.situacaoProcesso.id === StatusProcessoEnum.SOLIC_FINALIZ_OP_AUDITORIA_NEGACAO) {
        //     this.iconExclamation.style.display = 'block';
        // }
   
        return null;
    }

    /* em caso de atraso */
    defineVisibility() {
        if (this.progresso && (this.porcentagem > 100 || this.progresso.diasAtraso > 0)) {
            return "block";
        } else {
            return "none";
        }
    }

    private configurarTipoDias(progresso: ProgressoDTO) {
        if (progresso) {
            if ('SIM' === progresso.diaUtil) {
                if (progresso.diasPrazo > 1) {
                    this._tipoDias = "dias úteis";
                } else {
                    this._tipoDias = "dia útil";
                }
            } else {
                if (progresso.diasPrazo > 1) {
                    this._tipoDias = "dias corridos";
                } else {
                    this._tipoDias = "dia corrido";
                }
            }
        }
    }

    private calcularPercentualDias(progresso: ProgressoDTO) {
        if (progresso) {
            const diasPrazo = progresso.diasPrazo === 99 ? null : progresso.diasPrazo;
            const diasDecorridos = progresso.diasDecorridos;
            const diasAtraso = this.progresso.diasAtraso;

            if (diasAtraso > 0) {
                // Porcentagem negativa (atraso)
                this.porcentagem = (diasAtraso / diasDecorridos) * 100;
              
                if (this.porcentagem < 0) {
                    this.porcentagem = 0;
                }
            } else if (diasDecorridos > 0) {
                // Porcentagem positiva
                this.porcentagem = diasDecorridos / diasPrazo * 100;
            }
        } else if ( this._processoPedido.ultimaSituacao.situacaoProcesso.id == StatusProcessoEnum.CADASTRADO_SISTEMA_SAUDE ) {

            this.porcentagem = 100;
        }
    }

    defineColorProgresso() {
        if (!this.progresso) {
            return '#E5E5E5';
        }
        
        if (!this.progresso.diasAtraso || this.progresso.diasAtraso == 0) {
            return '#E5E5E5';
        } else if (this.progresso.diasAtraso > 0) {
            return this.defineColorBD(); 
        } 
        
    }

    private configurarMensagemProcesso() {
        if (this._processoPedido && this._processoPedido.ultimaSituacao){
            this.mensagemProcesso = this._processoPedido.ultimaSituacao.situacaoProcesso.mensagemProcesso;

            if(this._processoPedido.ultimaSituacao.prazo != 99) {
                if(this.mensagemProcesso){
                    this.mensagemProcesso = this.mensagemProcesso.replace(/@DIAS/g, this.progresso ? String(this.progresso.diasPrazo) : '').replace(/@TIPO_DIAS/g, this._tipoDias);
                }
            }else{
                this.mensagemProcesso = this._processoPedido.ultimaSituacao.situacaoProcesso.deMensagemProcessoSemPrazo;
            }
            
            
        }
    }
}
