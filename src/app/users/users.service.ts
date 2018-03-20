import {BaseApi} from '../base-api';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {arrayify} from 'tslint/lib/utils';

@Injectable()
export class UsersService extends BaseApi {
    filters = [{
        title: 'access_level',
        value: 'guest,admin'
    }, {
        title: 'enable',
        value: 'true'
    }, {
        title: 'page',
        value: '1'
    }, {
        title: 'pagesize',
        value: '20'
    }, {
        title: 'gender',
        value: ''
    }, {
        title: 'username',
        value: ''
    }, {
        title: 'email',
        value: ''
    }, {
        title: 'sorted',
        value: ''
    }, {
        title: 'lastlogin_from',
        value: '1512129600'
    }, {
        title: 'lastlogin_to',
        value: (Math.ceil(Date.now() / 1000)).toString()
    }];

    ignoreDateFilters = false;

    constructor (public http: HttpClient) {
        super(http);
    }

    getUsers() {
        let newFilters = [];
        if (this.ignoreDateFilters) {
            this.filters.forEach(function (item) {
                if (item.title !== 'lastlogin_from' && item.title !== 'lastlogin_to') {
                    newFilters.push(item);
                }
            });
        } else {
            newFilters = this.filters;
        }
        return this.get('/user/list', newFilters);
    }

    getUser(id) {
        return this.get('/user/info', [{title: 'id', value: id}]);
    }

    findParam(name) {
        return this.filters.find(param => param.title === name);
    }

    deleteUser(data) {
        return this.post('/user/delete', data);
    }
}
