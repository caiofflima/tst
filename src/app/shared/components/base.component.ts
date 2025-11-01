import { HttpErrorResponse } from '@angular/common/http';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { MessageService } from '../../../app/shared/components/messages/message.service';
import { SessaoService } from '../../../app/arquitetura/shared/services/seguranca/sessao.service';

import { Usuario } from '../../../app/arquitetura/shared/models/cadastrobasico/usuario';
import * as constantes from '../../../app/shared/constantes';
import { Calendar } from 'primeng/calendar';
import { Subject } from 'rxjs';
import { Directive, OnDestroy } from '@angular/core';
import { Util } from '../../arquitetura/shared/util/util';

declare let jQuery: any;

@Directive()
export class BaseComponent implements OnDestroy {
  baseURL: string;
  baseTitulo: string;
  protected readonly unsubscribe$ = new Subject<void>();
  protected usuario: Usuario;

  constructor(protected messageService: MessageService) {
    this.messageService = messageService;
    this.usuario = SessaoService.usuario;
  }

  /**
   * Trata as mensagens de erro da API
   * @param response
   */
  trataMsgErroApi(response: HttpErrorResponse): string[] {
    const arrError: any[] = [];

    if (response instanceof HttpErrorResponse) {
      // Erros de validação da API
      if (response.status === 422) {
        if (typeof response.error === 'string') {
          const msg = JSON.parse(response.error);
          if (typeof msg.message === 'string') {
            arrError.push(msg.message);
          }
        }

        const objErrorValidation = response.error.errors;
        // Coloca todas as mensagens em um array
        this.pushMensagensParaArray(objErrorValidation, arrError);
      } else {
        // Verifica se é uma mensagem simples
        if (
          typeof response.error === 'object' &&
          typeof response.error.message === 'string'
        ) {
          arrError.push(response.error.message);
        }

      this.handleErrorTypeString(response,
        arrError)
      }
    }

    return arrError;
  }
  
  handleErrorTypeString(response:any,arrError:any){
    if (typeof response.error === 'string') {
        const msg = JSON.parse(response.error);
        if (typeof msg.message === 'string') {
          arrError.push(msg.message);
        }
      }
  }

  pushMensagensParaArray(objErrorValidation: any, arrError: any) {
    for (const keyGroup in objErrorValidation) {
      if (objErrorValidation.hasOwnProperty(keyGroup)) {
        for (const key in objErrorValidation[keyGroup]) {
          if (objErrorValidation[keyGroup].hasOwnProperty(key)) {
            arrError.push(objErrorValidation[keyGroup][key]);
          }
        }
      }
    }
  }

  validaSeCampoValido(formulario: FormGroup, nomeCampo: string) {
    const campo: AbstractControl<any, any> | null = formulario.get(nomeCampo);

    return (campo?.dirty || campo?.touched) && campo?.invalid;
  }

  aplicaClasseDeErro(formulario: FormGroup, nomeCampo: string) {
    return { 'has-danger': this.validaSeCampoValido(formulario, nomeCampo) };
  }

  getClone(object: any): any {
    return JSON.parse(JSON.stringify(object));
  }

  idField(values: string[]): string {
    let idField = 'field_';
    values.forEach((value) => {
      idField += value + '_';
    });
    return idField.substring(0, idField.length - 1);
  }

  showPaginacao(lista: Array<any>): boolean {
    return lista && lista.length > 0;
  }

  hideModal(id: string): void {
    jQuery(this.idHashtag(id)).modal('hide');
  }

  idHashtag(id: string): string {
    return id ? '#' + id : '';
  }

  dateToString(data: Date): string | null {
    const dt = Util.getDate(data);
    return dt ? dt.toLocaleDateString('pt-br') : null;
  }

  public bundle(key: string, args?: any): string {
    return this.messageService.fromResourceBundle(key, args);
  }

  public showWarningMsg(msg: string, args?: any): void {
    this.messageService.addMsgWarning(this.bundle(msg, args));
  }

  public showDangerMsg(msg: string, args?: any): void {
    this.messageService.addMsgDanger(this.bundle(msg, args));
  }

  public showYesNoDialog(msg: string, callBack: Function): void {
    this.messageService.addConfirmYesNo(
      msg,
      () => {
        callBack();
      },
      undefined,
      null,
      'Sim',
      'Não'
    );
  }

  public showSuccessMsg(msg: string, args?: any): void {
    this.messageService.addMsgSuccess(this.bundle(msg, args));
  }

  public showAlertDialog(
    title: string,
    msg: string,
    callback?: Function
  ): void {
    this.messageService.addSimpleCustomOk(title, msg, () => {
      if (callback) {
        callback();
      }
    });
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  isFormularioAoMenosUmItemPreenchido(formGroup: FormGroup): boolean {
    for (let field of Object.keys(formGroup.controls)) {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        if (this.validarCampos(control.value)) {
          return true;
        }
      }
    }

    return false;
  }

  validarCampos(obj: any): boolean | undefined {
    if (typeof obj === 'string' || Array.isArray(obj)) {
      return obj != null && obj.length > 0;
    } else if (
      typeof obj === 'number' ||
      obj instanceof Date ||
      typeof obj === 'boolean'
    ) {
      return obj != null;
    } else if (obj != null) {
      for (let key of Object.keys(obj)) {
        if ('_$visited' != key) {
          return this.validarCampos(obj[key]);
        }
      }
    }
    return undefined;
  }

  get constantes(): any {
    return constantes;
  }

  protected inputDateMask(cal: Calendar): void {
    if (cal && cal.inputfieldViewChild) {
      let nativeElement = cal.inputfieldViewChild.nativeElement;
      nativeElement.addEventListener('keyup', (e) => BaseComponent.fmtDate(e));
    }
  }

  private static fmtDate(evt): void {
    let v = evt.target.value;
    if (v && v.replace(/\D/g, '').length > 8) {
      v = v.replace(/\D/g, '').substr(0, 8);
      evt.preventDefault();
    }
    evt.target.value = BaseComponent.doMaskData(v);
  }

  private static doMaskData(v): string {
    v = v.replace(/\D/g, '');
    v = v.replace(/(\d{2})(\d)/, '$1/$2');
    v = v.replace(/(\d{2})(\d)/, '$1/$2');
    v = v.replace(/(\d{2})(\d{2})$/, '$1$2');
    return v;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
