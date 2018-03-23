import {BaseApi} from '../base-api';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable()
export class HandlesService extends BaseApi {
    filters = [{
        title: 'pagesize',
        value: '20'
    }, {
        title: 'page',
        value: '1'
    }];

    public handleModalOpened = false;

    constructor(public http: HttpClient) {
        super(http);
    }

    getHandles() {
        return this.get('/user/handle/recent', this.filters);
    }

    findParam(name) {
        return this.filters.find(param => param.title === name);
    }
}
