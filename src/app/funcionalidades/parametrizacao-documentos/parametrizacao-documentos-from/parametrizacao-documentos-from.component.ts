import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {SelectItem} from "primeng/api";
import {TipoDocumentoService} from "../../../shared/services/comum/tipo-documento.service";
import {Documento} from "../../../shared/models/comum/documento";
import {AscValidators} from "../../../shared/validators/asc-validators";
import {BaseComponent} from "../../../shared/components/base.component";
import {MessageService} from "../../../shared/components/messages/message.service";
import {DocumentoService} from "../../../shared/services/comum/documento.service";
import {Location} from "@angular/common";
import {Util} from "../../../arquitetura/shared/util/util";
import { take } from 'rxjs';

@Component({
    selector: 'asc-parametrizacao-documentos-from',
    templateUrl: './parametrizacao-documentos-from.component.html',
    styleUrls: ['./parametrizacao-documentos-from.component.scss']
})
export class ParametrizacaoDocumentosFromComponent extends BaseComponent {

    id: number;
    documento: Documento = new Documento();

    idTipoDocumento = this.formBuilder.control(null);
    nome = this.formBuilder.control(null, [Validators.maxLength(450)]);
    descricao = this.formBuilder.control(null, [Validators.maxLength(4000)]);
    enderecoDocumento = this.formBuilder.control(null, [Validators.maxLength(1000)]);
    inativo = this.formBuilder.control(false);
    opme = this.formBuilder.control(false);
    dataInativacao = this.formBuilder.control(null, AscValidators.dataIgualAtualMaior);
    dataCadastramento = this.formBuilder.control(null);
    codigoUsuarioCadastramento = this.formBuilder.control(null);

    formulario: FormGroup = this.formBuilder.group({
        idTipoDocumento: this.idTipoDocumento,
        nome: this.nome,
        descricao: this.descricao,
        enderecoDocumento: this.enderecoDocumento,
        inativo: this.inativo,
        opme: this.opme,
        dataInativacao: this.dataInativacao,
        dataCadastramento: this.dataCadastramento,
        codigoUsuarioCadastramento: this.codigoUsuarioCadastramento,
        id: this.formBuilder.control(null)
    });

    tipoDocumentos: SelectItem[];

    constructor(
        protected override messageService: MessageService,
        private activatedRoute: ActivatedRoute,
        private tipoDocumentoservice: TipoDocumentoService,
        private documentoService: DocumentoService,
        private formBuilder: FormBuilder,
        private router: Router,
        private location: Location
    ) {
        super(messageService);
        this.getTipoDocumento();
        this.id = this.activatedRoute.snapshot.params['id'];

        this.consultarEstadoInicialDocumentos();
    }

    private consultarEstadoInicialDocumentos(): void{
        if (this.id) {
            this.documentoService.get(this.activatedRoute.snapshot.params["id"]).pipe(take(1)).subscribe(
                (documento: Documento) => {
                this.documento = documento;
                this.documento.dataInativacao = Util.getDate(documento.dataInativacao);
                this.enderecoDocumento.setValue(null);

                for (let key in this.documento) {
                    if (this.formulario.get(key) != undefined) {
                        this.formulario.get(key).setValue(this.documento[key]);
                    }
                }
                this.getTipoDocumento();
            });
        }
    }

    limparCampos() {
        this.formulario.reset();
        this.formulario.markAsPristine();
        this.formulario.markAsUntouched();
        this.formulario.updateValueAndValidity();
    }

    getTipoDocumento(): void {
        this.tipoDocumentoservice.consultarTodos().subscribe(result => {
            this.tipoDocumentos = result.map(item => ({
                label: item.nome,
                value: item.id
            }));
        });
    }

    public restaurarCampos(): void {
        this.consultarEstadoInicialDocumentos();
    }

    public salvar(): void {
        let documento = this.formulario.value;
        if (!this.documento.id) {
            this.documentoService.post(documento).subscribe(async res => {
                this.documento = res;
                this.showSuccessMsg(this.bundle("MA038"));
                await this.router.navigate(['manutencao/parametros/documentos/buscar'],{
                    queryParams:{
                        id: res.id,
                        nome: this.nome.value
                    }
                });
                }, err => this.showDangerMsg(err.error));
            } else {
                this.documentoService.put(documento).subscribe(async () => {
                    this.showSuccessMsg(this.bundle("MA022"));
                    await this.router.navigate(['manutencao/parametros/documentos/buscar'],{
                        queryParams:{
                            id: this.id,
                            nome: this.nome.value
                    }
                });
            }, err => this.showDangerMsg(err.error));
        }
    }

    public excluir() {
        this.messageService.addConfirmYesNo(this.bundle("MA021"), () => {
            this.documentoService.delete(this.id).subscribe(async () => {
                    this.showSuccessMsg(this.bundle("MA039"));
                    await this.router.navigate(['manutencao/parametros/documentos/buscar']);
                }, err => this.showDangerMsg(err.error)
            );
        });
    }

    public onChangeInativo(inativo: boolean) {
        if (inativo) {
            this.dataInativacao.setValue(new Date())
        } else {
            this.dataInativacao.reset();
        }
    }

    voltar(): void {
        this.location.back();
    }
}
