import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ArquivoParam} from '../models/arquivo.param';
import {isUndefinedNullOrEmpty} from '../../../constantes';
import {MessageService} from '../../messages/message.service';
import {BundleUtil} from "../../../../arquitetura/shared/util/bundle-util";
import {DocumentoTipoProcesso} from "../../../models/dto/documento-tipo-processo";

@Component({
    selector: 'asc-file-selector',
    templateUrl: './asc-file-selector.component.html',
    styleUrls: [
        './asc-file-selector.component.scss',
        './asc-file-selector-show-resumo.component.scss'
    ]
})
export class AscFileSelectorComponent implements OnInit {

    @Input()
    inputId: string;

    @Input()
     documento: DocumentoTipoProcesso;

    @Input()
    extensions: string;

    @Input()
    limitLengthFile: number;

    @Input()
    multiple = true;

    @Input()
    isInResumo = false;

    @Input()
    disabled = false;

    @Output()
    arquivos = new EventEmitter<ArquivoParam>();

    files: Set<File>;
    private extensionsAsArray: string[] = [];
    private _index: number;

    constructor(
        private readonly messageService: MessageService
    ) {
    }

    ngOnInit() {
        if (this.extensions) {
            this.extensionsAsArray = this.extensions.split(',');
        }
    }

    onChangeFile(inputFile: HTMLInputElement): void {
        const selectedFiles = inputFile.files;
        if (!selectedFiles || selectedFiles.length == 0) {
            inputFile.value = '';
            return;
        }

        try {
            this.files = new Set<any>();
            this.validarArquivosSelecionados(selectedFiles);
            this.arquivos.emit({files: this.files, param: this.documento});
        } catch (e) {
            for (let msg of e) {
                this.messageService.addMsgDanger(msg);
            }
        }

        inputFile.value = '';
    }

    private validarArquivosSelecionados(selectedFiles: FileList) {
        const erros = [];
        if (selectedFiles && selectedFiles.length > 10) {
            erros.push(BundleUtil.fromBundle("MA025"));
        }
        const fileWithProblem = [];
        for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles.item(i);
            this.proceedFile(file, fileWithProblem);
        }

        if (fileWithProblem && fileWithProblem.length) {
            const fileErrorExtensions = fileWithProblem.filter(fileError => fileError.typeError === 'ERROR_EXTENSION');
            const fileErrorLength = fileWithProblem.filter(fileError => fileError.typeError === 'ERROR_SIZE');
            if (fileErrorExtensions && fileErrorExtensions.length) {
                erros.push(BundleUtil.fromBundle("MA023"));
            }
            if (fileErrorLength && fileErrorLength.length) {
                erros.push(BundleUtil.fromBundle("MA024"));
            }
        }
        if (erros.length)
            throw erros;
    }

    private proceedFile(file: File, fileWithProblem: any[]) {
        if (this.isNotAllowedExtensions(file)) {
            fileWithProblem.push({typeError: 'ERROR_EXTENSION', file});
        } else if (file.size > this.limitLengthFile) {
            fileWithProblem.push({typeError: 'ERROR_SIZE', file});
        } else {
            this.files.add(file);
        }
    }

    private isNotAllowedExtensions(file: File): boolean {
        return isUndefinedNullOrEmpty(this.extensionsAsArray) ? true : !this.extensionsAsArray
        .includes(/(?:\.([^.]+))?$/.exec(file.name.toLocaleLowerCase())[0]);
    }

    @Input()
    set index(index: number) {
        this._index = index
    }
}
