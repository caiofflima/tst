import {AbstractControl, FormGroup} from "@angular/forms";
import {isNotUndefinedNullOrEmpty, isUndefinedNullOrEmpty} from "../constantes";
import {tap} from "rxjs/operators";
import {Observable} from "rxjs";

export class FormUtil {
  private constructor() {
    throw new Error('Class cannot be instantiate')
  }


  static registrarPropriedadesDoFormulario<T>(formSettings: T, form: FormGroup) {
    form.reset();
    Object.keys(formSettings)
    .filter(key => isNotUndefinedNullOrEmpty(formSettings[key]))
    .forEach(key => {
      const validators = formSettings[key].validators;
      const control = form.get(key);
      if (isUndefinedNullOrEmpty(validators) || (validators && validators.every(isUndefinedNullOrEmpty))) {
        control.clearValidators()
      } else {
        control.setValidators(validators);
      }
      control.updateValueAndValidity();
    })
    form.updateValueAndValidity();

  }

  static markAsTouchedAndDirtyEachControl<T>(obj: T, form: FormGroup) {
    const _isNotUndefinedNullOrEmpty = (key) => isNotUndefinedNullOrEmpty(obj[key])
    Object.keys(obj)
    .filter(_isNotUndefinedNullOrEmpty)
    .forEach(key => {
      const control = form.get(key);
      control.markAsDirty()
      control.markAsTouched()
      control.updateValueAndValidity()
    })

  }

  static isValidAndTouchedOrDirty(form: FormGroup, controlName: string): boolean {
    const control = form.get(controlName);
    return control && control.valid && (control.dirty || control.touched)
  }

  static limparTodosFormControls<T>(formSettings: T, form: FormGroup) {
    Object.keys(formSettings).forEach(key => {
      const control = form.get(key)
      control.setValue(null);
      control.reset();
      control.updateValueAndValidity();
    })
  }

  static insertValueOnForm<T>(formControl: FormGroup, obj: T): void {
    const objectToForm = Object.keys(formControl.controls)
    .reduce((acc, currentKey) => ({...acc, [currentKey]: obj[currentKey]}), {});
    formControl.setValue(objectToForm);
    Object.keys(formControl.controls).forEach(key => {
      formControl.get(key).markAsTouched()
      formControl.get(key).markAsDirty()
    })

  }

  static resetEachFormControl(form: FormGroup) {
    Object.keys(form.controls).forEach(key => form.controls[key].reset())
  }

  static resetFormMinusKey(keyToRemove: string, form: FormGroup) {
    Object.keys(form.controls).filter(key => keyToRemove !== key).forEach(key => {
      if (form.get(key)) {
        form.get(key).setValue(null);
        form.get(key).reset();
      }
    });
  }

  static setNullAndMarkAssUntouched(keys: string[], formGroup: FormGroup) {
    for (const key of keys) {
      const control = formGroup.get(key);
      if (control) {
        control.setValue(null);
        control.reset();
        control.updateValueAndValidity();
      }
    }
  }

  static markAsTouchedAndDirty(idAutorizacaoPrevia: AbstractControl) {
    idAutorizacaoPrevia.markAsTouched();
    idAutorizacaoPrevia.markAsDirty();
  }

  static markAsUntouchEachControl(form: FormGroup) {
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      control.markAsUntouched();
      control.reset();
    });
  }
}
