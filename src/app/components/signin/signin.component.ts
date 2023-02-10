import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.sass']
})
export class SigninComponent implements OnInit{

    formGroup!:FormGroup;
    hide=true;

    constructor(private formBuilder: FormBuilder,private auth:AuthService,private router: Router) {
    }

    ngOnInit(): void {
      this.formGroup = this.formBuilder.group({
        email: ['',[Validators.required,Validators.email]],
        password: ['',Validators.required]
      })
    }


    submit(){

      this.auth.signIn(this.formGroup.value).then(() =>{
        this.formGroup.reset();
      });

    }


  client(){
    this.formGroup.get('email')?.setValue("u1@gmail.com");
    this.formGroup.get('password')?.setValue("qwerty");
  }

  manager(){
    this.formGroup.get('email')?.setValue("manager@gmail.com");
    this.formGroup.get('password')?.setValue("123456");
   }

   admin(){
    this.formGroup.get('email')?.setValue("admin@gmail.com");
    this.formGroup.get('password')?.setValue("qwerty");
   }
}
