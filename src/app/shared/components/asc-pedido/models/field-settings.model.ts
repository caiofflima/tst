import {ValidatorFn, Validators} from "@angular/forms";

interface FieldSettings {
  display: boolean,
  validators?: Validators | ValidatorFn | ValidatorFn[]
}

const displayAndRequired: FieldSettings = {display: true, validators: [Validators.required]};
const displayAndValidatorDefaultQuantidadeSolicitada: FieldSettings = {
  display: true,
  validators: [Validators.min(1), Validators.minLength(1), Validators.max(999), Validators.maxLength(3)]
};
const noDisplayAndNoRequired: FieldSettings = {display: false, validators: [null]};

export {FieldSettings, displayAndRequired, displayAndValidatorDefaultQuantidadeSolicitada, noDisplayAndNoRequired}
