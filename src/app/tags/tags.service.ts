import { BaseApi } from '../base-api';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class TagsService extends BaseApi {
    constructor (public http: HttpClient) {
        super(http);
    }

    filters = [{
        title: 'from',
        value: '1512129600'
    }, {
        title: 'to',
        value: (Math.ceil(Date.now() / 1000)).toString()
    }, {
        title: 'pagesize',
        value: '20'
    }, {
        title: 'page',
        value: '1'
    }, {
        title: 'sorted',
        value: ''
    }];

    findParam(name) {
        return this.filters.find(param => param.title === name);
    }

    getTags() {
        return this.get('/tag/list', this.filters);
    }

    getTag(id) {
        return this.get('/tag/info', [{title: 'id', value: id}]);
    }
}
