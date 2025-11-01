import {MedicamentoPatologia} from '../../../shared/models/comum/medicamento-patologia';
import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {BaseComponent} from 'app/shared/components/base.component';
import {MedicamentoPatologiaService} from 'app/shared/services/comum/medicamento-patologia.service';
import {MedicamentoService} from 'app/shared/services/comum/pedido/medicamento.service';
import {MessageService, PatologiaService} from 'app/shared/services/services';
import {Patologia,SimNaoEnum} from 'app/shared/models/entidades';
import {Medicamento} from 'app/shared/models/comum/medicamento';
import {debounceTime, take} from 'rxjs/operators';
import {SelectItem} from 'primeng/api';
import {Util} from "../../../arquitetura/shared/util/util";
import {Location} from "@angular/common";


@Component({
    selector: 'asc-vinc-med-patologia-form',
    templateUrl: './vinc-med-patologia-form.component.html',
    styleUrls: ['./vinc-med-patologia-form.component.scss']
})
export class VincMedPatologiaFormComponent extends BaseComponent implements OnInit {

    id: number;

    idMedicamento: number;

    idPatologia: number;

    nomeMedicamento: string = "";

    nomePatologia: string = "";

    inativo = this.formBuilder.control(false);

    patologia = this.formBuilder.control(null, [Validators.required]);

    medicamento = this.formBuilder.control(null, [Validators.required]);

    dataInativacao = this.formBuilder.control(null);

    timeout: any;
    termoBusca: string = '';

    formulario = this.formBuilder.group({
        patologia: this.patologia,
        inativo: this.inativo,
        medicamento: this.medicamento,
        dataInativacao: this.dataInativacao,
        historico: this.formBuilder.control(''),
    });

    patologias: SelectItem[] = [];

    medicamentos: SelectItem[] = [];

    medicamentoPatologia: MedicamentoPatologia = new MedicamentoPatologia();

    @Input()
    selectId: string;

    data: SelectItem[];

    constructor(
        messageService: MessageService,
        private readonly patologiaService: PatologiaService,
        private readonly medicamentoService: MedicamentoService,
        private readonly medicamentoPatologiaService: MedicamentoPatologiaService,
        private readonly formBuilder: FormBuilder,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly location: Location
    ) {
        super(messageService);
    }

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        //this.retonaListaMedicamentos();
        this.buscarMedicamentosComFiltro();

        if (this.id) {
            this.buscarDadosEdicao();
        } else {
            this.buscarPatologias();
        }

    }

    buscarMedicamentosComFiltro() {
        if (this.termoBusca.length >= 3) {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
              this.consultarMedicamentosComFiltro();
            }, 300);
        }else{
            this.medicamentos = [{
                value: null,
                label: this.bundle(null)
            }]
        }
    }

    consultarMedicamentosComFiltro(){
        this.medicamentoService.consultar(this.termoBusca).pipe(
            take<Medicamento[]>(1)
        ).subscribe(res => {
            this.medicamentos = [{
                value: null,
                label: this.bundle(null)
            }, ...res.map(ob => ({
                filtering: ob.id + ' - ' + ob.nome.toUpperCase() + ' - ' + ob.codigoApresentacao.toUpperCase() + ' - ' + ob.laboratorio.nome.toUpperCase(),
                label: this.formatarNumeroTiss(ob.numeroTiss) + ' / ' + ob.laboratorio.nome + ' / ' + ob.nome + ' / ' + ob.descricaoApresentacao,
                value: ob.id
            }))]
        });
    }

    recuperarMedicamentoPorNome(nome:string){
        const valueInativo =  SimNaoEnum.NAO;
        this.medicamentoService.consultar(nome).pipe(
            take<Medicamento[]>(1)
        ).subscribe(res => {
            res = res.filter(ma => this.getValueInativo(ma.inativo) === this.getValueInativoNao(valueInativo));
            this.medicamentos = [{
                value: null,
                label: this.bundle(null)
            }, ...res.map(ob => ({
                filtering: ob.id + ' - ' + ob.nome.toUpperCase() + ' - ' + ob.codigoApresentacao.toUpperCase() + ' - ' + ob.laboratorio.nome.toUpperCase(),
                label: this.formatarNumeroTiss(ob.numeroTiss) + ' / ' + ob.laboratorio.nome + ' / ' + ob.nome + ' / ' + ob.descricaoApresentacao,
                value: ob.id
            }))]
        });
    }

    private buscarDadosEdicao(): void {
        this.medicamentoPatologiaService.get(this.id).pipe(
            take<MedicamentoPatologia>(1)
        ).subscribe(medicamentoPatologia => {
            this.medicamentos = [];
            this.patologias = [];
            this.medicamentoPatologia = medicamentoPatologia;

            this.inativo.setValue(this.medicamentoPatologia.inativo === 'SIM');
            this.formulario.get("historico").setValue(this.medicamentoPatologia.descricaoHistorico);
            this.dataInativacao.setValue(Util.getDate(this.medicamentoPatologia.dataInativacao));

            this.medicamento.setValue(this.medicamentoPatologia.idMedicamento);
            this.patologia.setValue(this.medicamentoPatologia.idPatologia);

            this.buscarMedicamento(this.medicamentoPatologia.idMedicamento);
            this.buscarPatologia(this.medicamentoPatologia.idPatologia);
        });
    }

    public restaurarCampos(): void {
        this.buscarDadosEdicao();
    }

    public buscarPatologias(): void {
        this.patologiaService.consultarTodosAtivos().pipe(take(1)).subscribe((res: Patologia[]) => {
            this.patologias = res.map(ob => ({label: ob.codigo + ' - ' + ob.nome, value: ob.id}));
        }, error => this.messageService.addMsgDanger(error));
    }

    public buscarMedicamento(idMedicamento: number) {
        this.medicamentoService.get(idMedicamento).pipe(
            take<Medicamento>(1)
        ).subscribe(m => {
            this.nomeMedicamento = this.formatarNumeroTiss(m.numeroTiss) + ' / ' + m.laboratorio.nome + ' / ' + m.nome + ' / ' + m.descricaoApresentacao
        }, error => this.messageService.addMsgDanger(error));
    }

    public retonaListaMedicamentos(): void {
        this.medicamentoService.consultarTodosMedicamentosAtivos(true).subscribe(res => {
            this.medicamentos = res.map(obj => ({
                value: obj.id,
                label: this.formatarNumeroTiss(obj.numeroTiss) + ' / ' + obj.laboratorio.nome + ' / ' + obj.nome + ' / ' + obj.descricaoApresentacao
            }))
        })
    }

    public buscarPatologia(idPatologia: number) {
        this.patologiaService.get(idPatologia).pipe(
            take<Patologia>(1)
        ).subscribe(p => this.nomePatologia = p.codigo + ' - ' + p.nome, error => this.messageService.addMsgDanger(error));
    }

    public salvar(form: any): void {
        if (this.formulario.valid) {
            const medicamento: MedicamentoPatologia = {
                id: this.id,
                idMedicamento: form.medicamento,
                idPatologia: form.patologia,
                inativo: form.inativo ? 'SIM' : 'NAO',
                dataInativacao: form.dataInativacao,
                descricaoHistorico: form.historico
            }

            if (!this.id) {
                this.medicamentoPatologiaService.post(medicamento).subscribe(res => {
                    this.retorna(res);
                    this.showSuccessMsg(this.bundle("MA038"));
                }, err => this.showDangerMsg(err.error))
            } else {
                this.medicamentoPatologiaService.put(medicamento).subscribe(res => {
                    this.retorna(res);
                    this.showSuccessMsg(this.bundle("MA022"));
                }, err => this.showDangerMsg(err.error))
            }
        } else {
            this.showDangerMsg(this.bundle('MA144'));
        }
    }

    private retorna(medicamentoPatologia: MedicamentoPatologia): void {
        this.router.navigate(['/manutencao/vinc-med-patologia/listar'], {
            queryParams: {
                patologia: medicamentoPatologia.idPatologia,
                medicamento: medicamentoPatologia.idMedicamento
            }
        });
    }

    voltar(): void {
        this.location.back();
    }

    public limparCampos() {
        this.medicamentos = [];
        this.formulario.reset();
        this.formulario.markAsPristine();
        this.formulario.markAsUntouched();
        this.formulario.updateValueAndValidity();
    }

    updateValue(value) {
        this.medicamento.setValue(value);
        this.medicamento.markAsDirty();
        this.medicamento.markAsTouched();
    }

    public onChangeInativo(inativo: boolean) {
        if (inativo) {
            this.dataInativacao.setValue(new Date())
            this.dataInativacao.setValidators(Validators.required);
        } else {
            this.dataInativacao.clearValidators();
            this.dataInativacao.setValue(null);
            this.dataInativacao.markAsPristine();
            this.dataInativacao.markAsUntouched();
            this.dataInativacao.updateValueAndValidity();
        }
    }

    public excluir() {
        this.messageService.addConfirmYesNo(this.bundle("MA021"), () => {
            this.medicamentoPatologiaService.excluir(this.medicamentoPatologia.id).subscribe(() => {
                    this.showSuccessMsg(this.bundle("MA039"));

                    this.router.navigate(['/manutencao/vinc-med-patologia/listar'], {});
                }, err => this.showDangerMsg(err.error)
            );
        });
    }

    filtroMedicamentos(event: string) {
        if (event && event.length > 3) {
            this.medicamentoService.consultarTodosMedicamentosAtivos(true).pipe(
                debounceTime<Medicamento[]>(1000),
                take<Medicamento[]>(1)
            ).subscribe(res => {
                this.medicamentos = res.map(ob => ({
                    filtering: ob.id + ' ' + ob.nome.toUpperCase() + ' ' + ob.codigoApresentacao.toUpperCase() + ' ' + ob.laboratorio.nome.toUpperCase(),
                    label: this.formatarNumeroTiss(ob.numeroTiss) + ' / ' + ob.laboratorio.nome + ' / ' + ob.nome + ' / ' + ob.descricaoApresentacao,
                    value: ob.id
                }));
            })
        } else {
            this.medicamentos = [];
        }
    }

    filtroMedicamento(event: string) {
        if (event && event.length > 2) {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
              this.recuperarMedicamentoPorNome(event);
            }, 100);           
        } else {
            this.medicamentos = [];
        }
    }

    getValueInativoNao(valorInativo: SimNaoEnum) {
        const jsonString = JSON.stringify(valorInativo);
        const parsedObj = JSON.parse(jsonString);
        const valorInativoNAO = parsedObj.codigo;
        return valorInativoNAO;
    }

    getValueInativo(valorInativo: SimNaoEnum) {
        const jsonString = JSON.stringify(valorInativo);
        const parsedObj = JSON.parse(jsonString);
        const valorInativoNAO: string = parsedObj.charAt(0);
        return valorInativoNAO;
    }

    formatarNumeroTiss(numeroTiss: number): string {
        var numeroTissStr = numeroTiss.toString();
        while (numeroTissStr.length < 10) {
            numeroTissStr = '0' + numeroTissStr;
        }
        return numeroTissStr;
    }

}
