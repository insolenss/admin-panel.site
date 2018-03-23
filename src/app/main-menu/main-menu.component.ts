import { Component, OnInit } from '@angular/core';
import {UserParamsService} from '../user-params.service';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {

  constructor(public userParamsService: UserParamsService, private authService: AuthService) { }

  ngOnInit() {}

  public logout() {
    this.authService.logout();
  }

}
