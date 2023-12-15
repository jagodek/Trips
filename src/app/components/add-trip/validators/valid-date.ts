import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function validDateValidator(): ValidatorFn{
  return (control: AbstractControl): ValidationErrors | null =>{
    let date = new Date(control.value);
    let d = new Date(date.getFullYear(), date.getMonth(),date.getDate());
    let today  = new Date();
    let curr = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return curr > d ? {forbiddenDate : {value: control.value}} : null;
  }
}

