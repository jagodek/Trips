import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { concatMapTo } from 'rxjs';
import { AuthService } from '../../services/auth.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control?.invalid && control?.parent?.dirty);
    const invalidParent = !!(control?.parent?.invalid && control?.parent?.dirty);
    return invalidCtrl || invalidParent;
  }
}



@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.sass']
})
export class SignupComponent implements OnInit{

  formGroup!:FormGroup;
  hide=true;
  matcher = new MyErrorStateMatcher();

  constructor(private formBuilder: FormBuilder,private auth:AuthService, private router: Router) {
  }

  // checkPasswords: Validators = (group: AbstractControl):  ValidationErrors | null => {
  //     let pass = this.formGroup.get('password')?.value;
  //     let confirmPass = this.formGroup.get('passwor2')?.value
  //     return pass === confirmPass ? null : { notSame: true }
  //   }

  checkPasswords(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let pass = this.formGroup?.get('password')?.value;
      let confirmPass = control.value;


      return pass === confirmPass ? null : { notSame: true };
    };
  }
  ngOnInit(): void {

    this.formGroup = this.formBuilder.group({
      email: ['',[Validators.required,Validators.email]],
      name:['',[Validators.required]],
      password: ['',[Validators.required,Validators.minLength(6),this.checkPasswords()]],
      password2:['',[Validators.required,this.checkPasswords()]]
    })

  }


  submit(){

    this.auth.signUp(this.formGroup.value);
    this.formGroup.reset();

  }
}
