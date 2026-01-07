import {TipoProcessoEnum} from "../../models/tipo-processo.enum";
import {EventEmitter, Input, OnDestroy, OnInit, Output} from "@angular/core";
import {DocumentoFiscal} from "../../../../../funcionalidades/processos/reembolso/models/documento-fiscal.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AscValidators} from "../../../../validators/asc-validators";
import {Municipio} from "../../../../models/comum/municipio";
import {BehaviorSubject, Subject} from "rxjs";
import {PedidoProcedimento} from "../../../../models/entidades";
import {delay, filter, map, switchMap, takeUntil, tap} from "rxjs/operators";
import {isNotUndefinedNullOrEmpty, isNotUndefinedOrNull} from "../../../../constantes";
import {BundleUtil} from "../../../../../arquitetura/shared/util/bundle-util";
import {DadoComboDTO} from "../../../../models/dto/dado-combo";
import {LocalidadeService} from "../../../../services/comum/localidade.service";
import {CustomOperatorsRxUtil} from "../../../../util/custom-operators-rx-util";
import {AscComponenteAutorizado} from "../../asc-componente-autorizado";
import {Util} from "../../../../../arquitetura/shared/util/util";

const nomeCampoNumeroDoConselho = 'Número do Conselho';

const DEFAULT_VALUE = -1

interface TipPropriedades {
    nome: string,
    somenteNumero: boolean;
}

const definirPropriedades: { [key: number]: TipPropriedades } = {
    [TipoProcessoEnum.REEMBOLSO_VACINA]: {nome: nomeCampoNumeroDoConselho, somenteNumero: false},
    [TipoProcessoEnum.REEMBOLSO_ODONTOLOGICO]: {nome: nomeCampoNumeroDoConselho, somenteNumero: false},
    [TipoProcessoEnum.REEMBOLSO_CONSULTA]: {nome: nomeCampoNumeroDoConselho, somenteNumero: false},
    [TipoProcessoEnum.REEMBOLSO_ASSISTENCIAL]: {nome: nomeCampoNumeroDoConselho, somenteNumero: false},
    [DEFAULT_VALUE]: {nome: nomeCampoNumeroDoConselho, somenteNumero: false},
    [TipoProcessoEnum.REEMBOLSO_MEDICAMENTO]: {nome: 'Nome ou Razão Social', somenteNumero: false},
}

export class DocumentosFiscalBase extends AscComponenteAutorizado implements OnInit, OnDestroy {

    private tipoProcesso$: number;
    valorMinimo = 0;
    maiorDataProcesso: Date;
    idEstado = new FormControl(null, [Validators.required]);
    idMunicipio = new FormControl(null, [Validators.required]);

    get idTipoProcesso(): number {
        return this.tipoProcesso$;
    }

    @Input()
    set idTipoProcesso(tipo: number) {
        this.tipoProcesso$ = tipo;

        if (this.isTipoMedicamento) {
            this.cpfCnpj.clearValidators();
            this.cpfCnpj.setValidators([Validators.required, AscValidators.cnpjValidator()]);
        }
    }

    get isTipoMedicamento(): boolean {
        return this.tipoProcesso$ == TipoProcessoEnum.REEMBOLSO_MEDICAMENTO;
    }

    @Output()
    documentoFiscal$ = new EventEmitter<DocumentoFiscal>();

    cpfCnpj = new FormControl(null, [Validators.required, AscValidators.cpfOuCnpj()])

    readonly formularioDocumentoFiscal = new FormGroup({
        cpfCnpj: this.cpfCnpj,
        nome: new FormControl(null, [Validators.required, Validators.max(200)]),
        idEstado: this.idEstado,
        idMunicipio: this.idMunicipio,
        numeroDoc: new FormControl(null, [Validators.required, Validators.maxLength(10)]),
        data: new FormControl(null, [
            Validators.required,
            AscValidators.diasDecorridosMaior(180),
            AscValidators.dataAtualMenor
        ]),
        valor: new FormControl(null, [
            Validators.required,
            Validators.min(0.000000001),
            Validators.minLength(1),
            Validators.max(99999.99),
            Validators.maxLength(9)
        ]),
    });
    protected readonly unsubscribe$ = new Subject<void>();
    protected readonly pedidoProcedimentos$ = new BehaviorSubject<PedidoProcedimento[]>(null);

    protected _documentoFiscal: DocumentoFiscal;

    matricula: any;
    protected municipio: Municipio;
    protected uf: DadoComboDTO;
    properidadeCampoValorOuNumero: TipPropriedades;
    protected _pedidoProcedimentos: PedidoProcedimento[] = [];

    protected constructor(protected readonly localidadeService: LocalidadeService) {
        super();
    }

    @Input() set pedidoProcedimentos(pedidoProcedimentos: PedidoProcedimento[]) {
        this._pedidoProcedimentos = pedidoProcedimentos;
        if (pedidoProcedimentos && pedidoProcedimentos.length) {
            this.maiorDataProcesso = pedidoProcedimentos.map(p => Util.getDate(p.dataAtendimento)).filter(d => d).reduce((a, b) => a > b ? a : b, null);

            this.formularioDocumentoFiscal.get('data').setValidators([
                Validators.required,
                AscValidators.diasDecorridosMaior(180),
                AscValidators.dataAtualMenor,
                AscValidators.dataMenor(this.maiorDataProcesso)
            ]);
        }
        setTimeout(() => this.pedidoProcedimentos$.next(pedidoProcedimentos), 0);
    }

    get pedidoProcedimentos() {
        return this._pedidoProcedimentos
    }

    ngOnInit() {
       // this.registrarValorMinimoComBaseNosProcedimento();
       // this.atualizarCampoValorOuNumero();
       // this.registrarBuscaDeMunicipio();
    }

    ngAfterViewInit() {
        this.registrarValorMinimoComBaseNosProcedimento();
        this.atualizarCampoValorOuNumero();
        this.registrarBuscaDeMunicipio();
    }

    ngAfterContentChecked() {
        if (this.pedidoProcedimentos && this.pedidoProcedimentos.length) {
            this.maiorDataProcesso = this.pedidoProcedimentos.map(p => Util.getDate(p.dataAtendimento)).filter(d => d).reduce((a, b) => a > b ? a : b, null);

            this.formularioDocumentoFiscal.get('data').setValidators([
                Validators.required,
                AscValidators.diasDecorridosMaior(180),
                AscValidators.dataAtualMenor,
                AscValidators.dataMenor(this.maiorDataProcesso)
            ]);
        }
    }

    protected atualizarCampoValorOuNumero() {
        this.properidadeCampoValorOuNumero = definirPropriedades[this.idTipoProcesso] || definirPropriedades[DEFAULT_VALUE];
    }

    municipioSelecionado(municipio: Municipio) {
        this.municipio = municipio;
    }

    ufSelecionado(uf: DadoComboDTO) {
        this.uf = uf;
        if (!uf) {
            this.idMunicipio.reset();
        }
    }

    setMunicipio(dados: Municipio[]) {
        if (!dados || !dados.length) {
            return;
        }
        
        if (this.idMunicipio.value && dados.find(m => m.id === this.municipio.id)) {
            this.idMunicipio.setValue(this.municipio.id);
        } else {
            this.idMunicipio.reset();
        }
            
       
    }

    protected registrarValorMinimoComBaseNosProcedimento() {
        this.pedidoProcedimentos$.pipe(
            delay(100),
            filter(isNotUndefinedNullOrEmpty),
            map((pedidoProcedimentos: PedidoProcedimento[]) => pedidoProcedimentos
            .reduce((acc, current: PedidoProcedimento) => acc + (Number(current.valorUnitarioPago) * (current.qtdSolicitada || 1)), 0)),
            tap((totalValorUnitarioPago: number) => this.definirValorMinimo(totalValorUnitarioPago)),
            takeUntil(this.unsubscribe$)
        ).subscribe()

        //console.log('registrarValorMinimoComBaseNosProcedimento');
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    bundle(key: string, params?: any) {
        return BundleUtil.fromBundle(key, params);
    }

    /**
     * <strong>RN110:</strong> O valor total do documento fiscal deve ser maior que 0 (Zero) e menor ou igual à soma dos valores totais dos procedimentos adicionados ao pedido.
     * @param totalValorUnitarioPago
     * @protected
     */
    protected definirValorMinimo(totalValorUnitarioPago: number) {
        this.valorMinimo = totalValorUnitarioPago;
        this.formularioDocumentoFiscal.get('valor').setValidators([
            Validators.required,
            AscValidators.min(totalValorUnitarioPago),
            Validators.max(99999.99),
        ])

        // console.log('totalValorUnitarioPago');
        // console.log(totalValorUnitarioPago);
    }

    protected definirMaiorData(maiorData: Date) {
        this.maiorDataProcesso = maiorData;
        this.formularioDocumentoFiscal.get('data').setValidators([
            Validators.required,
            AscValidators.dataMenor(maiorData),
        ])
    }

    private registrarBuscaDeMunicipio(): void {
        this.formularioDocumentoFiscal.get('idMunicipio').valueChanges.pipe(
            CustomOperatorsRxUtil.filterNotEmptyAndDistinctUntilChanged(),
            switchMap((idMunicipio: number) => this.localidadeService.consultarDadosComboMunicipiosMesmaUFPorIdMunicipio(idMunicipio).pipe(
                map((municipios: Municipio[]) => municipios.find(municipio => municipio.id === idMunicipio))
            )),
            CustomOperatorsRxUtil.filterBy(() => isNotUndefinedOrNull(this._documentoFiscal)),
            tap((municipio: Municipio) => this._documentoFiscal.municipioAsObject = municipio),
            takeUntil(this.unsubscribe$),
        ).subscribe()
    }
}
