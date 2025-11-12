import {Component} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {take} from "rxjs/operators";
import {Location} from "@angular/common";

import {NumberUtil} from "../../../shared/util/number-util";
import {ArrayUtil} from "../../../shared/util/array-util";
import {BaseComponent} from "../../../shared/components/base.component";
import {MessageService} from "../../../shared/components/messages/message.service";
import {FiltroMotivoSolicitacaoTipoPedido} from '../../../shared/models/filtro/filtro-motivo-solicitacao-tipo-pedido';
import {MotivoSolicitacaoTipoPedidoService} from "../../../shared/services/comum/motivo-solicitacao-tipo-pedido.service";
import {MotivoSolicitacaoTipoPedidoDTO} from 'app/shared/models/dto/motivo-solicitacao-tipo-pedido';
import {MotivoSolicitacaoTipoPedidoConsultaDTO} from 'app/shared/models/dto/motivo-solicitacao-tipo-pedido-consulta';
import {MotivoSolicitacaoTipoPedidoBeneficiariosDTO} from 'app/shared/models/dto/motivo-solicitacao-tipo-pedido-beneficiarios';

@Component({
    selector: 'asc-parametrizacao-motivo-tipo-pedido-listar',
    templateUrl: './parametrizacao-motivo-tipo-pedido-listar.component.html',
    styleUrls: ['./parametrizacao-motivo-tipo-pedido-listar.component.scss']
})
export class ParametrizacaoMotivoTipoPedidoListarComponent extends BaseComponent {
    id: number;
    isRetorno: boolean = false;
    loading = false;
    listaTotal: number = 0;
    filtro = new FiltroMotivoSolicitacaoTipoPedido();
    listaTipoProcessoMotivoSolicitacao: MotivoSolicitacaoTipoPedidoConsultaDTO[];
    listaTipoProcessoMotivoSolicitacaoBeneficiarios: MotivoSolicitacaoTipoPedidoBeneficiariosDTO[];

    descricaoSexo : string;
    descricaoMotivoSolicitacao: string;
    descricaoTipoDeficiencia : string;
    descricaoTiposProcesso: string;
    descricaoTiposBeneficiario: string;

    constructor(
        override readonly messageService: MessageService,
        private readonly router: Router,
        private readonly location: Location,
        private readonly serviceMotivo: MotivoSolicitacaoTipoPedidoService,
        private readonly route: ActivatedRoute
    ) {
        super(messageService);
        this.id = this.route.snapshot.queryParams['id'];
        this.isRetorno = this.route.snapshot.queryParams['isRetorno'];
        this.retornaValorFiltro();
    }

    private retornaValorFiltro(): void { 
        this.filtro.id = this.id;
        this.filtro.sexo = ArrayUtil.get<string>(this.route.snapshot.queryParams['sexo']);
        this.filtro.somenteAtivos = this.route.snapshot.queryParams['somenteAtivos'];
        this.filtro.tiposProcesso = NumberUtil.getArray(this.route.snapshot.queryParams['tiposProcesso']);
        this.filtro.tiposBeneficiario = NumberUtil.getArray(this.route.snapshot.queryParams['tiposBeneficiario']);
        this.filtro.idTipoDeficiencia = this.route.snapshot.queryParams['idTipoDeficiencia'];
        this.descricaoSexo = this.route.snapshot.queryParams['descricaoSexo'] || 'Todas';
        this.descricaoMotivoSolicitacao = this.route.snapshot.queryParams['descricaoMotivoSolicitacao'] || 'Todas';
        this.descricaoTipoDeficiencia = this.route.snapshot.queryParams['descricaoTipoDeficiencia'] || 'Todas';
        this.descricaoTiposProcesso = this.route.snapshot.queryParams['descricaoTiposProcesso'] || 'Todas';
        this.descricaoTiposBeneficiario = this.route.snapshot.queryParams['descricaoTiposBeneficiario'] || 'Todas';
    }

    ngOnInit(): void {
        this.pesquisaInicial();
    }

    public pesquisaInicial(): void {
        this.loading = true;

        this.consultarFiltro();
        this.consultarFiltroAgrupar();

    }

    private consultarFiltro() {
        this.serviceMotivo.consultarPorFiltro(this.filtro).pipe(
            take(1)
        ).subscribe({
            next: (res: MotivoSolicitacaoTipoPedidoConsultaDTO[]) => {
                this.listaTipoProcessoMotivoSolicitacao = res;
                if (this.isRetorno) {
                    this.listaTotal = 1;
                    this.listaTipoProcessoMotivoSolicitacao = [this.listaTipoProcessoMotivoSolicitacao[0]];
                    this.isRetorno = false;
                }
                this.loading = false;
            },
            error: (err) => {
                this.showDangerMsg(err.error);
                this.loading = false;
            }
        });
    }

    private consultarFiltroAgrupar() {
        this.serviceMotivo.consultarPorFiltroAgrupar(this.filtro).pipe(
            take(1)
        ).subscribe({
            next: (res: MotivoSolicitacaoTipoPedidoBeneficiariosDTO[]) => {
                this.listaTipoProcessoMotivoSolicitacaoBeneficiarios = res;
    
                if (this.isRetorno) {
                    this.listaTotal = 1;
                    this.listaTipoProcessoMotivoSolicitacaoBeneficiarios = [this.listaTipoProcessoMotivoSolicitacaoBeneficiarios[0]];
                    this.isRetorno = false;
                }
    
                this.loading = false;
            },
            error: (err) => {
                this.showDangerMsg(err.error);
                this.loading = false;
            }
        });
    }

    public pesquisar($event): void {
        this.loading = true;

        this.serviceMotivo.consultarPorFiltro(this.filtro).pipe(
            take(1)
        ).subscribe({
            next: (res: MotivoSolicitacaoTipoPedidoConsultaDTO[]) => {
                this.listaTipoProcessoMotivoSolicitacao = res;
            },
            error: (err) => {
                this.showDangerMsg(err.error);
                this.loading = false;
            }
        });
    }

    public novo(): void {
        this.router.navigateByUrl('/manutencao/parametros/motivo-tipo-pedido/novo');
    }


    public formatarSimNao(texto: string):string {
        if(texto && texto.toUpperCase() ==="NAO"){
            return "NÃO";
        } 
        else
            return texto;
    }

    public editar(motivoSolicitacaoTipoPedidoDTO: MotivoSolicitacaoTipoPedidoDTO): void {
        this.router.navigateByUrl('manutencao/parametros/motivo-tipo-pedido/editar/' + motivoSolicitacaoTipoPedidoDTO.id);
    }

    public editarMotivo(motivoSolicitacaoTipoPedidoBeneficiariosDTO: MotivoSolicitacaoTipoPedidoBeneficiariosDTO): void {
        localStorage.setItem('motivoSolicitacaoTipoPedidoBeneficiariosDTO', JSON.stringify(motivoSolicitacaoTipoPedidoBeneficiariosDTO));
        this.router.navigateByUrl('manutencao/parametros/motivo-tipo-pedido/editar');
    }

    public remover(motivoSolicitacaoTipoPedidoDTO: MotivoSolicitacaoTipoPedidoDTO): void {
        this.messageService.addConfirmYesNo(this.bundle("MA021"), () => {
            this.serviceMotivo.delete(motivoSolicitacaoTipoPedidoDTO.id).pipe(take(1)).subscribe({
                next: () => {
                    this.showSuccessMsg(this.bundle("MA039"));
                    this.pesquisaInicial();
                },
                error: (err) => this.showDangerMsg(err.error)
            });
        });
    }

    public voltar(): void {
        this.location.back();
    }
    
}
