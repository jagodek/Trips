import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-err404',
  templateUrl: './err404.component.html',
  styleUrls: ['./err404.component.sass']
})
export class Err404Component implements OnInit{

  constructor(private auth:AuthService){}

  ngOnInit(): void {
    this.auth.handleUser();

  }

}
