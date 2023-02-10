import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function validDateValidator(): ValidatorFn{
  return (control: AbstractControl): ValidationErrors | null =>{
    var date = new Date(control.value);
    var d = new Date(date.getFullYear(), date.getMonth(),date.getDate());
    var today  = new Date();
    var curr = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return curr > d ? {forbiddenDate : {value: control.value}} : null;
  }
}

