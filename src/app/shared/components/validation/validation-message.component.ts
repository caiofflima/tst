import {Component, Input} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

import {ValidationResource} from './validation-resource';

/**
 * Responsável por prover o recursos de visualização
 * de mensagem de validação, interceptando o erro e
 * tratando a mensagem a ser apresentada.
 */
@Component({
  selector: 'app-validation-message',
  templateUrl: './validation-message.component.html',
  styleUrls: ['./validation-message.component.scss']
})
export class ValidationMessageComponent {
  @Input() for: FormControl;
  @Input() form: FormGroup;
  private validationResource: ValidationResource;

  /**
   * Construtor da classe.
   */
  constructor() {
    console.log(" ");
  }

  /**
   * Retorna a mensagem conforme o erro detectado.
   */
  public errors(): string[] {
    const errors = [];

    if (this.for.errors !== null) {
      for (const error of Object.keys(this.for.errors)) {
        if (this.for.hasError(error)) {
          let message = this.validationResource.getMessage(error);

          if (message === undefined) {
            message = error;
          }
          errors.push(message);
        }
      }
    }

    return errors;
  }
}
