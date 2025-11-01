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
        private readonly motivoSolicitacaoService: MotivoSolicitacaoService
    ) {
        super(messageService);
    }

    ngOnInit() {
        this.getSexo();
        this.inicializarCombos();
        this.getTipoDeficiencia();
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
        const idMotivoSolicitacao = this.formulario.get('idMotivoSolicitacao').value ? this.formulario.get('idMotivoSolicitacao').value.map(v => v.value) : null;
        const sexo = this.formulario.get('sexo').value ? this.formulario.get('sexo').value.map(v => v.value) : null;
        const idTipoDeficiencia = this.formulario.get('idTipoDeficiencia').value ? this.formulario.get('idTipoDeficiencia').value.map(v => v.value) : null;
        const tiposBeneficiario = this.formulario.get('tiposBeneficiario').value ? this.formulario.get('tiposBeneficiario').value.map(v => v.value) : null;
        const tiposProcesso = this.formulario.get('tiposProcesso').value ? this.formulario.get('tiposProcesso').value.map(v => v.value) : null;

        const descricaoSexo = this.formulario.get('sexo').value ? this.formulario.get('sexo').value.map(v => v.label).join(', ') : null;
        const descricaoMotivoSolicitacao = this.formulario.get('idMotivoSolicitacao').value ? this.formulario.get('idMotivoSolicitacao').value.map(v => v.label).join(', ') : null;
        const descricaoTipoDeficiencia = this.formulario.get('idTipoDeficiencia').value ? this.formulario.get('idTipoDeficiencia').value.map(v => v.label).join(', ') : null;
        const descricaoTiposProcesso = this.formulario.get('tiposProcesso').value ? this.formulario.get('tiposProcesso').value.map(v => v.label).join(', ') : null;
        const descricaoTiposBeneficiario = this.formulario.get('tiposBeneficiario').value ? this.formulario.get('tiposBeneficiario').value.map(v => v.label).join(', ') : null;


        this.router.navigate(['/manutencao/parametros/motivo-tipo-pedido/buscar'], {
            queryParams: {
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
        }).then();
    }

    public limparCampos(): void {
        this.formulario.reset();
        this.formulario.markAsPristine();
        this.formulario.markAsUntouched();
        this.formulario.updateValueAndValidity();
    }

    public voltar(): void {
        this.location.back();
    }

}
