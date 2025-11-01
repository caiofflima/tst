import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Location } from "@angular/common";
import { FormControl, FormGroup } from "@angular/forms";
import { AtendimentoService } from "../../../shared/services/comum/atendimento.service";
import { Atendimento } from "../../../shared/models/comum/atendimento";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription, take } from "rxjs";
import { AscModalTitularContratoComponent } from './asc-modal-titular-contrato.component';
import { BeneficiarioService, MessageService } from 'app/shared/services/services';
import { ContratoDTO } from '../../../shared/models/dto/contrato';


@Component({
    selector: 'asc-navegacao-titular-home',
    templateUrl: './navegacao-titular-home.component.html'
})
export class NavegacaoTitularHomeComponent implements OnInit, OnDestroy {

    private atendimentoSubscription: Subscription;

    matricula = new FormControl("");

    atendimento = false;

    showModalIniciarAtendimento = false;

    @ViewChild(AscModalTitularContratoComponent)
    modalTitularContrato: AscModalTitularContratoComponent;

    contratoSelecionado: any;

    formulario: FormGroup = new FormGroup({
        matricula: this.matricula
    });

    contratos: ContratoDTO[] = [];

    constructor(
        private readonly router: Router,
        private readonly location: Location,
        private readonly messageService: MessageService,
        private readonly atendimentoService: AtendimentoService,
        private readonly activatedRoute: ActivatedRoute,
        private service: BeneficiarioService,
    ) {
    }

    ngOnInit() {
        if (AtendimentoService.atendimento) {
            this.atendimento = true;
            this.matricula.setValue(AtendimentoService.atendimento.matricula);
        }

        this.atendimentoSubscription = AtendimentoService.changed.subscribe(atendimento => {
            if (atendimento) {
                this.atendimento = true;
                this.matricula.setValue(AtendimentoService.atendimento.matricula);
            }
        });
    }

    ngOnDestroy() {
        this.atendimentoSubscription.unsubscribe();
    }

    voltar() {
        this.location.back();
    }

    iniciarAtendimento(matricula: string, familiaSelecionada?: string) {
        this.atendimentoService.iniciar(matricula, familiaSelecionada).pipe(take(1)).subscribe(async (atendimento: Atendimento) => {
            this.matricula.setValue(atendimento.matricula);
            this.atendimento = true;
            this.messageService.addMsgSuccess(`Você está navegando em nome do(a) titular ${atendimento.matricula} — ” ${atendimento.nome}`);
            await this.router.navigate(['/home']);
        }, error => {
            console.log("[Matricula] " + matricula);
            console.log("[Error] " + error.error);
            console.log("[Message] " + error.message);
            this.messageService.addMsgDanger(error.error)
        });
    }

    iniciarAtendimentoContrato(matricula: string) {
        this.service.consultarContratosBeneficiarioPorMatricula(matricula).subscribe(res => {
            this.contratos = [];
            this.contratos = res;
            //Código comentado para Retirar o módulo de Iniciar Atendimento com múltiplos contratos
           // if (this.contratos.length > 1) {
           //     this.iniciarContrato();
           // } else {
                this.iniciarAtendimento(matricula);
           // }
        }, (err) => {
            this.messageService.addMsgDanger(err.error);
        });
    }

    limparCampos() {
        this.matricula.setValue(null);
        this.matricula.markAsPristine();
        this.matricula.markAsUntouched();
    }

    encerrarAtendimento() {
        this.atendimentoService.finalizar().pipe(take(1)).subscribe(async () => {
            this.atendimento = false;
            this.messageService.addMsgSuccess("Atendimento encerrado.");
            await this.router.navigate(['/home']);
        }, error => this.messageService.addMsgDanger(error.error));
    }

    get tituloAcompanhamento(): boolean {
        let urlAtiva = this.activatedRoute.snapshot['_routerState'].url;
        return urlAtiva.includes("acompanhamento");
    }

    iniciarContrato() {
        this.modalTitularContrato.abrirModal(this.contratos);
    }

    confirmarContrato(opcaoSelecionada: any) {  
        let matriculaSelecionada = this.formulario.get('matricula').value;
        this.iniciarAtendimento(matriculaSelecionada, opcaoSelecionada);
    }

    fecharModalContrato() {
        this.modalTitularContrato._listaContratos = []
        this.contratos = [];
    }

}
