import { Component, OnInit } from '@angular/core';
import { user } from '@angular/fire/auth';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { settings, User } from 'src/app/interfaces';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.sass']
})
export class AdminPanelComponent implements OnInit{

  formGroup!:FormGroup;
  settings!:settings;
  userList?:User[];
  pType?:string;
  constructor(private auth:AuthService,private fb: FormBuilder){
    this.auth.getTimeout().subscribe(val => {
      this.settings = val;
      this.pType = val.timeoutType;
    })

    this.auth.getUserList().subscribe((data) =>
      {
        this.userList = data.slice(1,data.length);
      })

  }

  ngOnInit(): void {
    this.auth.handleUser();

  }

  ban(user:User){
    user.banned = true;
    this.auth.updateUser(user);
  }

  unban(user:User){
    user.banned = false;
    this.auth.updateUser(user);
  }

  updatePersistence(val:string){


    this.settings.timeoutType = val;
    this.auth.updatePers(this.settings);
  }

  updateRole(newRole:string,user:User){
    user.role = newRole;
    this.auth.updateUser(user);
  }

}
