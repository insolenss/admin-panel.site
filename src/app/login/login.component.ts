import {Component, Injectable, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
@Injectable()
export class LoginComponent implements OnInit {

    constructor(private authService: AuthService) { }
    userLogin = '';
    userPassword = '';
    ngOnInit() {
    }

    tryAuth() {
      if (!this.authService.tryAuth(this.userLogin, this.userPassword)) {
        this.userLogin = '';
        this.userPassword = '';
      }
    }

}
