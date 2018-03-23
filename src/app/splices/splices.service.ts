import {BaseApi} from '../base-api';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable()
export class SplicesService extends BaseApi {
    filters = [{
        title: 'ownerid',
        value: ''
    }, {
        title: 'status',
        value: ''
    }, {
        title: 'from',
        value: '1512129600'
    }, {
        title: 'to',
        value: (Math.ceil(Date.now() / 1000)).toString()
    }, {
        title: 'ending',
        value: ''
    }, {
        title: 'subtitles',
        value: ''
    }, {
        title: 'fragid',
        value: ''
    }, {
        title: 'pagesize',
        value: '20'
    }, {
        title: 'page',
        value: '1'
    }, {
        title: 'tagid',
        value: ''
    }, {
        title: 'sorted',
        value: ''
    }];

    public spliceModalOpened = false;

    constructor(public http: HttpClient) {
        super(http);
    }

    getSplices() {
        return this.get('/splice/list', this.filters);
    }

    getSplice(id) {
        return this.get('/splice/info', [{title: 'id', value: id}]);
    }

    findParam(name) {
        return this.filters.find(param => param.title === name);
    }

    deleteSplice(data) {
        return this.post('/splice/delete', data);
    }
}
