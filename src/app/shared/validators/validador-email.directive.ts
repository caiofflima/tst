import { AbstractControl, ValidatorFn } from "@angular/forms";

export function validarEmail(): ValidatorFn {
    const regexp = new RegExp( /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ );
    return ( control: AbstractControl ): { [key: string]: any } | null => {
        if ( control.value && control.value.length > 0 ) {
            const emailValido = regexp.test( control.value );
            return !emailValido ? { 'emailInvalido': { value: control.value } } : null;
        }
        return null;
    };
}