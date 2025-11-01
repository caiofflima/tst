import { Component, OnInit, Input, Directive } from '@angular/core';
import { BaseComponent } from 'app/shared/components/base.component';
import { MessageService } from 'app/shared/components/messages/message.service';

@Directive()
export class TrilhaDadosConsulta extends BaseComponent {
    @Input( 'dadosConsulta' )
    dadosConsulta: any[];
    showModalDetalhamento: boolean;
    selectedRow: any;

    abrirModalDetalhamento( row: any ): void {
        this.showModalDetalhamento = true;
        this.selectedRow = row;
    }

    fecharModalDetalhamento(): void {
        this.selectedRow = null;
        this.showModalDetalhamento = false;
    }

    constructor( protected override messageService: MessageService ) {
        super( messageService );
    }

}

@Component( {
    selector: "app-trilha-anexos-documentos",
    templateUrl: "./anexos-documentos.component.html"
} )
export class TrilhaAnexosDocumentosComponent extends TrilhaDadosConsulta implements OnInit {

    constructor( protected override messageService: MessageService ) {
        super( messageService );
    }

    ngOnInit() {console.log(" ");
    }

}

@Component( {
    selector: "app-trilha-dados-gerais",
    templateUrl: "./dados-gerais.component.html"
} )
export class TrilhaDadosGeraisComponent extends TrilhaDadosConsulta implements OnInit {

    constructor( protected override messageService: MessageService ) {
        super( messageService );
    }

    ngOnInit() {console.log(" ");
    }

}

@Component( {
    selector: "app-trilha-documentos",
    templateUrl: "./documentos.component.html"
} )
export class TrilhaDocumentosComponent extends TrilhaDadosConsulta implements OnInit {

    constructor( protected override messageService: MessageService ) {
        super( messageService );
    }

    ngOnInit() {console.log(" ");
    }

}

@Component( {
    selector: "app-trilha-empresa-prestador-externo",
    templateUrl: "./empresa-prestador-externo.component.html"
} )
export class TrilhaEmpresaPrestadorExternoComponent extends TrilhaDadosConsulta implements OnInit {

    constructor( protected override messageService: MessageService ) {
        super( messageService );
    }

    ngOnInit() {console.log(" ");
    }

}

@Component( {
    selector: "app-trilha-vinculos-empresa-prestador",
    templateUrl: "./vinculos-empresa-prestador.component.html"
} )
export class TrilhaVinculosEmpresaPrestadorComponent extends TrilhaDadosConsulta implements OnInit {

    constructor( protected override messageService: MessageService ) {
        super( messageService );
    }

    ngOnInit() {console.log(" ");
    }

}


@Component( {
    selector: "app-trilha-mensagens",
    templateUrl: "./mensagens.component.html",
    styleUrls: ["../trilha-auditoria.component.scss"]
} )
export class TrilhaMensagensComponent extends TrilhaDadosConsulta implements OnInit {

    headerMensagemProcesso: string;
    mostrarMensagem: boolean;
    mensagemSelecionada: any;

    constructor( protected override messageService: MessageService ) {
        super( messageService );
        this.mostrarMensagem = false;
    }

    ngOnInit() {console.log(" ");
    }

    exibirMensagem( row: any ) {
        this.headerMensagemProcesso = 'Mensagem - Número do Processo: ' + row.nroProcesso;
        this.mensagemSelecionada = row;
        this.mostrarMensagem = true;
    }

    fecharMensagem(): void {
        this.mostrarMensagem = false;
        this.mensagemSelecionada = null;
    }

}

@Component( {
    selector: "app-trilha-ocorrencias",
    templateUrl: "./ocorrencias.component.html"
} )
export class TrilhaOcorrenciasComponent extends TrilhaDadosConsulta implements OnInit {

    constructor( protected override messageService: MessageService ) {
        super( messageService );
    }

    ngOnInit() {console.log(" ");
    }

}

@Component( {
    selector: "app-trilha-perfil-prestador-externo",
    templateUrl: "./perfil-prestador-externo.component.html"
} )
export class TrilhaPerfilPrestadorExternoComponent extends TrilhaDadosConsulta implements OnInit {

    constructor( protected override messageService: MessageService ) {
        super( messageService );
    }

    ngOnInit() {console.log(" ");
    }

}

@Component( {
    selector: "app-trilha-prestador-externo",
    templateUrl: "./prestador-externo.component.html"
} )
export class TrilhaPrestadorExternoComponent extends TrilhaDadosConsulta implements OnInit {

    constructor( protected override messageService: MessageService ) {
        super( messageService );
    }

    ngOnInit() {console.log(" ");
    }

}

@Component( {
    selector: "app-trilha-procedimentos",
    templateUrl: "./procedimentos.component.html"
} )
export class TrilhaProcedimentosComponent extends TrilhaDadosConsulta implements OnInit {

    showModal: boolean;

    constructor( protected override messageService: MessageService ) {
        super( messageService );
    }

    ngOnInit() {console.log(" ");
    }

    abrirModalDetalheProcedimento( row: any ) {
        this.selectedRow = row;
        this.showModal = true;
    }

    fecharModalDetalheProcedimento(): void {
        this.selectedRow = null;
        this.showModal = false;
    }
}

@Component( {
    selector: "app-trilha-validacoes-documentos",
    templateUrl: "./validacoes-documentos.component.html"
} )
export class TrilhaValidacoesDocumentosComponent extends TrilhaDadosConsulta implements OnInit {

    constructor( protected override messageService: MessageService ) {
        super( messageService );
    }

    ngOnInit() {console.log(" ");
    }

}

@Component( {
    selector: "app-trilha-emails",
    templateUrl: "./emails.component.html"
} )
export class TrilhaEmailsComponent extends TrilhaDadosConsulta implements OnInit {

    private emailSelecionado: any;
    private mostrarTextoEmail: boolean;

    constructor( protected override messageService: MessageService ) {
        super( messageService );
    }

    ngOnInit() {console.log(" ");
    }

    public formatarBeneficiarios( bnfros: any[] ): String {
        let fmtBnfros = this.todosBeneficiariosConcatenados( bnfros );
        if ( fmtBnfros.length > 100 ) {
            fmtBnfros = fmtBnfros.substring( 0, 100 ) + '...';
        }
        return fmtBnfros;
    }

    public formatarBeneficiariosTitle( bnfros: any[] ): String {
        return this.todosBeneficiariosConcatenados( bnfros );
    }

    private todosBeneficiariosConcatenados( bnfros: any[] ) {
        let fmtBnfros = '';
        if ( bnfros ) {
            bnfros.forEach( b => fmtBnfros += b + ', ' );
            fmtBnfros = fmtBnfros.substring( 0, fmtBnfros.length - 2 );
        }
        return fmtBnfros;
    }


    public exibirTextoEmail( rowData: any ): void {
        this.emailSelecionado = rowData;
        this.mostrarTextoEmail = true;
    }

    public fecharTextoEmail(): void {
        this.emailSelecionado = null;
        this.mostrarTextoEmail = false;
    }
}

@Component( {
    selector: "app-trilha-tipos-destinatario-email",
    templateUrl: "./tipos-destinatario-email.component.html"
} )
export class TrilhaTiposDestinatarioEmailComponent extends TrilhaDadosConsulta implements OnInit {

    constructor( protected override messageService: MessageService ) {
        super( messageService );
    }

    ngOnInit() {console.log(" ");
    }
}

@Component( {
    selector: "app-trilha-gipes-empresa-prestador-externo",
    templateUrl: "./gipes-empresa-prestador-externo.component.html"
} )
export class TrilhaGipesEmpresaPrestadorExternoComponent extends TrilhaDadosConsulta implements OnInit {

    constructor( protected override messageService: MessageService ) {
        super( messageService );
    }

    ngOnInit() {console.log(" ");
    }

}

@Component( {
    selector: "app-trilha-autorizacoes-procedimentos",
    templateUrl: "./autorizacoes-procedimentos.component.html"
} )
export class TrilhaAutorizacoesProcedimentosComponent extends TrilhaDadosConsulta implements OnInit {

    showModalDetalheProcedimento: boolean;
    showModalDetalheMotivoNegacao: boolean;

    constructor( protected override messageService: MessageService ) {
        super( messageService );
    }

    ngOnInit() {console.log(" ");
    }

    abrirModalDetalheProcedimento( row ): void {
        this.selectedRow = row;
        this.showModalDetalheProcedimento = true;
    }

    fecharModalDetalheProcedimento(): void {
        this.showModalDetalheProcedimento = false;
        this.selectedRow = null;
    }

    abrirModalDetalheMotivoNegacao( row ): void {
        this.selectedRow = row;
        this.showModalDetalheMotivoNegacao = true;
    }

    fecharModalDetalheMotivoNegacao(): void {
        this.showModalDetalheMotivoNegacao = false;
        this.selectedRow = null;
    }



}



