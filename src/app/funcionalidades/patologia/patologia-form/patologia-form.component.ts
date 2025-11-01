import {Patologia} from '../../../shared/models/comum/patologia';
import {PatologiaService} from '../../../shared/services/comum/patologia.service';
import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MessageService} from 'app/shared/components/messages/message.service';
import {BaseComponent} from 'app/shared/components/base.component';
import {SelectItem} from "primeng/api";
import {Util} from "../../../arquitetura/shared/util/util";
import {AscValidators} from "../../../shared/validators/asc-validators";
import {Location} from "@angular/common";

@Component({
    selector: 'asc-patologia-form',
    templateUrl: './patologia-form.component.html',
    styleUrls: ['./patologia-form.component.scss']
})
export class PatologiaFormComponent extends BaseComponent {

    id: number;

    patologia: Patologia = new Patologia();

    patologiaRestore: Patologia

    codigo = this.formBuilder.control(null, [Validators.required, Validators.maxLength(15)]);
    nome = this.formBuilder.control(null, [Validators.required, Validators.maxLength(150)]);
    evento = this.formBuilder.control(null);

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

    inativo = this.formBuilder.control(false);

    dataInativacao = this.formBuilder.control(null, AscValidators.dataIgualAtualMaior);

    formulario: FormGroup = this.formBuilder.group({
        codigo: this.codigo,
        nome: this.nome,
        evento: this.evento,
        reembolso: this.formBuilder.control(null, [Validators.required, Validators.min(0.01), Validators.max(100)]),
        sexo: this.formBuilder.control(null),
        compoeTeto: this.formBuilder.control('N'),
        calculoPartipacao: this.formBuilder.control('N'),
        causaObito: this.formBuilder.control('N'),
        inativo: this.inativo,
        dataInativacao: this.dataInativacao,
        id: this.formBuilder.control(null)
    });

    constructor(
        override readonly messageService: MessageService,
        private readonly patologiaService: PatologiaService,
        private readonly formBuilder: FormBuilder,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly location: Location
    ) {
        super(messageService);

        this.id = this.route.snapshot.params['id'];
        this.consultarEstadoInicialPatologias();

    }

    private consultarEstadoInicialPatologias(): void{
        if (this.id) {
            this.patologiaService.consultarDTOPorId(this.route.snapshot.params["id"]).subscribe(patologia => {
                this.patologia = patologia;
                this.patologiaRestore = patologia;
                this.patologia.dataInativacao = Util.getDate(patologia.dataInativacao);

                for (let key in this.patologia) {
                    if (this.formulario.get(key) != undefined) {
                        this.formulario.get(key).setValue(this.patologia[key]);
                    }
                }
            });
        }
    }

    public onChangeInativo(inativo: boolean) {
        if (inativo) {
            this.dataInativacao.setValue(new Date())
        } else {
            this.dataInativacao.reset();
        }
    }

    public salvar(): void {
        const patologia = this.formulario.value as Patologia;

        if (!this.patologia.id) {
            this.patologiaService.incluir(patologia).subscribe(async res => {
                this.patologia = res;

                this.showSuccessMsg(this.bundle("MA038"));
                await this.router.navigate(['/manutencao/patologia/buscar'], {queryParams: {codigo: res.codigo}});
            }, err => this.showDangerMsg(err.error));
        } else {
            this.patologiaService.alterar(patologia).subscribe(async res => {
                this.showSuccessMsg(this.bundle("MA022"));
                await this.router.navigate(['/manutencao/patologia/buscar'], {queryParams: {codigo: res.codigo}});
            }, err => this.showDangerMsg(err.error));
        }
    }

    limparCampos() {
        this.formulario.reset();
        this.formulario.markAsPristine();
        this.formulario.markAsUntouched();
        this.formulario.updateValueAndValidity();

        this.formulario.get('codigo').setValue(this.patologiaRestore.codigo);
        this.formulario.get('compoeTeto').setValue('N');
        this.formulario.get('calculoPartipacao').setValue('N');
        this.formulario.get('causaObito').setValue('N');
    }

    public excluir() {
        this.messageService.addConfirmYesNo(this.bundle("MA021"), () => {
            this.patologiaService.excluir(this.id).subscribe(async () => {
                    this.showSuccessMsg(this.bundle("MA039"));
                    await this.router.navigate(['/manutencao/patologia/buscar']);
                }, err => this.showDangerMsg(err.error)
            );
        });
    }

    public restaurarCampos() {
        this.consultarEstadoInicialPatologias();
    }

    voltar(): void {
        this.location.back();
    }
}
