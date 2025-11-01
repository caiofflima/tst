import {Component, Input} from '@angular/core';
import {AscComponenteAutorizadoMessage} from "../../asc-componente-autorizado-message";
import {MessageService} from "../../../messages/message.service";
import {Pedido} from "../../../../models/comum/pedido";
import {InscricaoDependenteService} from "../../../../services/comum/inscricao-dependente.service";
import {PedidoDependenteDTO} from "../../../../models/dto/pedido-dependente";
import {TipoDependenteService} from "../../../../services/comum/tipo-dependente.service";
import {TipoDependente} from "../../../../models/comum/tipo-dependente";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AscValidators} from "../../../../validators/asc-validators";
import {SelectItem} from "primeng/api";
import {TipoDeficienciaService} from "../../../../services/comum/tipo-deficiencia.service";
import {Util} from "../../../../../arquitetura/shared/util/util";
import {DateUtil} from "../../../../util/date-util";
import {catchError, map, mergeMap, take} from "rxjs/operators";
import {NumberUtil} from "../../../../util/number-util";
import {Municipio} from "../../../../models/comum/municipio";
import {DadoComboDTO} from "../../../../models/dto/dado-combo";
import { somenteNumeros } from 'app/shared/constantes';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { BeneficiarioService } from 'app/shared/services/comum/beneficiario.service';
import { Beneficiario } from 'app/shared/models/comum/beneficiario';

@Component({
    selector: 'asc-dependentes-card',
    templateUrl: './asc-dependentes-card.component.html',
    styleUrls: ['./asc-dependentes-card.component.scss']
})
export class AscDependentesCardComponent extends AscComponenteAutorizadoMessage {

    modoEdicao: boolean = false;
    dependente: PedidoDependenteDTO;
    tipoBeneficiario: string;
    cpfRequired = false;
    apresentaDeclaracaoNascidoVivo = false;
    _processo: Pedido;

    id = new FormControl(null);
    nomeDependente = new FormControl(null);
    cpfDependente = new FormControl(null, [AscValidators.cpf]);
    dataNascimento = new FormControl(null, [AscValidators.dataMenorIgualAtual]);
    nomeMaeDependente = new FormControl(null);
    sexoDependente = new FormControl(null);
    nomePaiDependente = new FormControl(null);
    idEstadoCivil = new FormControl(null);
    declaracaoNascidoVivo = new FormControl(null);
    rg = new FormControl(null);
    rgOrgaoEmissor = new FormControl(null);
    idTipoDeficiencia = new FormControl(null);
    cartaoNacionalSaude = new FormControl(null);
    dataExpedicaoRg = new FormControl(null, [AscValidators.dataMenorIgualAtual]);
    cartaoDependete = new FormControl(null);
    idEstadoNaturalidade = new FormControl(null);
    valorRenda = new FormControl(null);
    idMunicipioNaturalidade = new FormControl(null);
    emailDependente = new FormControl(null);

    form = new FormGroup({
        id: this.id,
        nomeDependente: this.nomeDependente,
        cpfDependente: this.cpfDependente,
        dataNascimento: this.dataNascimento,
        nomeMaeDependente: this.nomeMaeDependente,
        sexoDependente: this.sexoDependente,
        nomePaiDependente: this.nomePaiDependente,
        idEstadoCivil: this.idEstadoCivil,
        declaracaoNascidoVivo: this.declaracaoNascidoVivo,
        rg: this.rg,
        rgOrgaoEmissor: this.rgOrgaoEmissor,
        idTipoDeficiencia: this.idTipoDeficiencia,
        cartaoNacionalSaude: this.cartaoNacionalSaude,
        dataExpedicaoRg: this.dataExpedicaoRg,
        cartaoDependete: this.cartaoDependete,
        idEstadoNaturalidade: this.idEstadoNaturalidade,
        valorRenda: this.valorRenda,
        idMunicipioNaturalidade: this.idMunicipioNaturalidade,
        emailDependente: this.emailDependente,
    });

    sexos: SelectItem[] = [{
        value: 'M',
        label: "Masculino"
    }, {
        value: 'F',
        label: "Feminino"
    }];

    tipoDeficiencias: SelectItem[];

    @Input()
    set processo(processo: Pedido) {
        this._processo = processo;
        if (processo && processo.id) {
            this.inscricaoDependenteService.findByPedido(processo.id).pipe(take(1)).subscribe(dependente => this.dependente = dependente);
            if (processo.idTipoBeneficiario) {
                this.tipoDependenteService.consultarTipoDependente(processo.idTipoBeneficiario).subscribe(tipo => {
                    if (tipo) {
                        this.tipoBeneficiario = tipo.descricao;
                    }
                }, (err) => {

                    this.messageService.addMsgDanger(err.error);
                });
            }
        }
    }

    get rgRequired(): boolean {
        return this.rg.value || this.rgOrgaoEmissor.value || this.dataExpedicaoRg.value;
    }

    constructor(
        private readonly inscricaoDependenteService: InscricaoDependenteService,
        private readonly tipoDependenteService: TipoDependenteService,
        private readonly tipoDeficienciaService: TipoDeficienciaService,
        private readonly beneficiarioService: BeneficiarioService,
        override readonly messageService: MessageService
    ) {
        super(messageService);

        this.tipoDeficienciaService.consultarTodos().subscribe(result => {
            this.tipoDeficiencias = result.map(item => ({
                label: item.descricao,
                value: item.id
            }));
        });
    }

    public clickAlerarDados(status) {
        this.modoEdicao = status;
        if (status) {
            this.form.patchValue({
                ...this.dependente,
                dataNascimento: Util.getDate(this.dependente.dataNascimento),
                dataExpedicaoRg: Util.getDate(this.dependente.dataExpedicaoRg)
            });
        }
    }

    verificarCpfEmOutraFamilia(): Observable<any> {
        console.log("verificarCpfEmOutraFamilia(){ ---");
        const cpfDependente = somenteNumeros(this.cpfDependente.value);
    
        console.log("Processo:", this._processo);
        if (!this._processo || this._processo.idTipoProcesso !== 11) {
            console.log("verificarCpfEmOutraFamilia() não será executado para idTipoProcesso diferente de 11");
            return of(false); // Retorna false se o idTipoProcesso não for 11
        }
    
        if (!this._processo || !this._processo.beneficiario.id) {
            console.error("ID do beneficiário não disponível no processo.");
            return of(false);
        }
    
        return this.beneficiarioService.consultarBeneficiarioPorId(this._processo.beneficiario.id).pipe(
            mergeMap((titular: Beneficiario) => {
                console.log("Titular retornado:", titular);
                const cpfTitular = somenteNumeros(titular.matricula.cpf);
    
                if (!cpfTitular) {
                    console.error("CPF do titular não encontrado.");
                    return of(false);
                }
    
                console.log("CPF do Titular:", cpfTitular);
                console.log("CPF do Dependente:", cpfDependente);
    
                return this.beneficiarioService.verificarCpfFamiliaDiferente(cpfDependente, cpfTitular);
            }),
            map(isDiferente => {
                if (isDiferente) {
                    const mensagem = "Proposto dependente já cadastrado em outra família.";
                    this.messageService.addMsgDanger(mensagem);
                    console.log(mensagem);
                }
                return isDiferente;
            }),
            catchError(error => {
                console.log("[ERRO] verificarCpfEmOutraFamilia()", error);
                this.messageService.showDangerMsg(error.message);
                return of(false);
            })
        );
    }
    
    
    
    
    public onSubmit() {
        this.verificarCpfEmOutraFamilia().subscribe(isCpfEmOutraFamilia => {
            if (!isCpfEmOutraFamilia) {
                this.inscricaoDependenteService.put({
                    ...this.form.value as PedidoDependenteDTO,
                    valorRenda: NumberUtil.convertStringToNumber(this.valorRenda.value)
                }).pipe(
                    take<PedidoDependenteDTO>(1)
                ).subscribe(dependente => {
                    this.dependente = dependente;
                    this.messageService.addMsgSuccess('Registro alterado com sucesso.');
                    this.clickAlerarDados(false);
                }, error => this.messageService.addMsgDanger(error.error));
            }
        });
    }

    getDescricaoSexo(sexo: string): string {
        if (sexo === 'M') {
            return 'Masculino';
        } else if (sexo === 'F') {
            return 'Feminino';
        }

        return null;
    }

    validDataNascimento() {
        const dataNascimento = this.dataNascimento.value;
        if (dataNascimento) {
            let data: Date = Util.getDate(dataNascimento);
            const idade = DateUtil.getIdade(data);

            if (idade <= 14) {
                this.cpfDependente.setValidators([Validators.required, AscValidators.cpf]);
                this.cpfDependente.updateValueAndValidity();
                this.cpfRequired = true;
            } else {
                this.cpfDependente.setValidators(AscValidators.cpf);
                this.cpfDependente.updateValueAndValidity();
                this.cpfRequired = false;
            }

            this.apresentaDeclaracaoNascidoVivo = idade <= 12;
        }
    }

    municipios(municipios: Municipio[]) {
        if (municipios && municipios.length && !municipios.find(m => m.id === this.idMunicipioNaturalidade.value)) {
            this.idMunicipioNaturalidade.reset();
        }
    }

    ufSelecionada(uf: DadoComboDTO) {
        if (uf == null) {
            this.idMunicipioNaturalidade.reset();
        }
    }


}
