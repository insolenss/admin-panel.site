import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Router} from '@angular/router';
import {BaseApi} from './base-api';
import {UserParamsService} from './user-params.service';
import {ErrorHandler} from './error-handler';

@Injectable()
export class AuthService extends BaseApi {
    // private isAuthorized = false;
    constructor(public http: HttpClient, public router: Router, private userParamsService: UserParamsService, private errorHandler: ErrorHandler) {
        super(http);
    }
    tryAuth(login: string, password: string) {
        this.post('/user/login',
            {
                login : login,
                password: password
            }
        ).subscribe((response: Response) => {
            if (response['error'] === 0) {
                localStorage.setItem('token', response['userinfo'].token);
                this.userParamsService.setAccessLevel(response['userinfo'].access_level);
                this.userParamsService.userName = response['userinfo'].username;
                this.router.navigate(['users']);
            } else {
                alert('Неверные данные!');
                return false;
            }
        });
    }

    checkAuthorization() {
        const token = localStorage.getItem('token');
        return token == null ? true : false;
    }

    logout() {
        this.post('/user/logout', {})
            .subscribe((response: Response) => {
                if (response['error'] == 0) {
                    localStorage.removeItem('token');
                    this.router.navigate(['login']);
                } else {
                    this.errorHandler.initError(response['error'], response['error_message']);
                }
            });
    }
}
