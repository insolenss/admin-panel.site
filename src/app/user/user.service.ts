import {BaseApi} from '../base-api';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable()
export class UserService extends BaseApi {
    constructor (public http: HttpClient) {
        super(http);
    }

    public getUser(id) {
        return this.get('/user/info', [{title: 'id', value: id}]);
    }

    public getUserAvatar(id) {
        return this.get('/user/avatar', [{userid: id}]);
    }

    public changeEnable(state, id) {
        return this.post('/user/enable', {
            enable: state,
            id: id
        });
    }

    public saveUserData(data) {
        return this.post('/user/change', data);
    }

    public changeAccessLevel(data) {
        return this.post('/user/grant', data);
    }
}
