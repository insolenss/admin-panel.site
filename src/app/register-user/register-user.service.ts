import {BaseApi} from '../base-api';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class RegisterUserService extends BaseApi {
    constructor(public http: HttpClient) {
        super(http);
    }
    registerUser(data) {
        return this.postRegister('/user/register', data);
    }
}
