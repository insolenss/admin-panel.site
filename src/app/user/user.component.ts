import {Component, Injectable, Input, OnInit} from '@angular/core';
import {UserService} from './user.service';
import {Helper} from '../helper';
import {Locales} from '../locales';
import {UserParamsService} from '../user-params.service';
import {ErrorHandler} from '../error-handler';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

@Injectable()
export class UserComponent implements OnInit {
  @Input() id: string;
  isEdit = false;

  editPassword = false;
  newPassword = '';

  localesArray = [];

  user: any;

  constructor(
      public userService: UserService,
      public locales: Locales,
      public userParamsService: UserParamsService,
      public errorHandler: ErrorHandler
  ) { }

  ngOnInit() {
    this.localesArray = this.locales.getLocales();
    if (this.id !== '') {
      this.initialiseUser();
    }
  }

  public initialiseUser() {
    this.userService.getUser(this.id)
        .subscribe((user: Response) => {
          if (user['error'] === 0 ) {
              this.user = user;

              this.userService.getUserAvatar(this.id)
                  .subscribe((avatar: Response) => {
                      this.user.avatar = avatar['error'] !== 0 ? '/assets/img/no-avatar.png' : avatar;
                  });
              console.log(this.id);
              console.log(this.user);
          } else {
              this.errorHandler.initError(user['error'], user['error_message']);
          }
        });
  }

  public changeEnable(event) {
      this.userService.changeEnable(event, this.id)
          .subscribe((response: Response) => {
              if (response['error'] === 0) {
                  this.initialiseUser();
              } else {
                  this.errorHandler.initError(response['error'], response['error_message']);
              }
          });
  }

  public saveUser() {

      const data: any = {};
      data.id = this.user.id;
      data.username = this.user.username;
      if (this.editPassword) {
          data.password = this.newPassword;
      }
      data.gender = this.user.gender;
      if (this.user.birthday) {
          data.birthday = this.user.birthday;
      }
      data.locale = this.user.locale;
      data.email = this.user.email;

      this.userService.saveUserData(data)
          .subscribe((response: Response) => {
              if (response['error'] === 0) {
                  this.initialiseUser();
              } else {
                  this.errorHandler.initError(response['error'], response['error_message']);
              }
          });
  }

  public changeAccessLevel(event) {
      const data: any = {};
      data.id = this.user.id;
      data.access = event;

      this.userService.changeAccessLevel(data)
          .subscribe((response: Response) => {
              if (response['error'] === 0) {
                  this.initialiseUser();
              } else {
                  this.initialiseUser();
                  this.errorHandler.initError(response['error'], response['error_message']);
              }
          });
  }

}
