import {Component, OnDestroy, OnInit} from '@angular/core';
import {RegisterUserService} from './register-user.service';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent implements OnInit, OnDestroy {

  public login = '';
  public password = '';
  public isFormValid = false;

  private ngUnsubscribe = new Subject();

  constructor(public registerUserService: RegisterUserService) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public registerUser() {
    const data = {
      login: this.login,
      password: this.password
    };
    this.registerUserService.registerUser(data)
      .pipe()
      .subscribe((response: Response) => {
        if (response['error'] === 0) {
            document.getElementById('successRegister').style.display = 'block';
            this.login = '';
            this.password = '';
        } else {
            document.getElementById('successRegister').style.display = 'none';
        }
      });
  }

  public validateForm() {
    if (this.login.length < 3) {
      this.isFormValid = false;
      return false;
    }
    if (this.password.length > 5) {
      const regexp = /^[a-zA-Z0-9#^%_.-]*$/;
      if (!regexp.test(this.password)) {
        this.isFormValid = false;
        return false;
      }
    } else {
      this.isFormValid = false;
      return false;
    }
    this.isFormValid = true;
    return true;
  }

}
