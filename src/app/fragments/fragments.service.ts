import {BaseApi} from '../base-api';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable()
export class FragmentsService extends BaseApi {
    filters = [{
        title: 'ownerid',
        value: ''
    }, {
        title: 'tagid',
        value: ''
    }, {
        title: 'from',
        value: '1512129600'
    }, {
        title: 'to',
        value: (Math.ceil(Date.now() / 1000)).toString()
    }, {
        title: 'status',
        value: 'private,public,global'
    }, {
        title: 'foreign_id',
        value: ''
    }, {
        title: 'foreign_movieid',
        value: ''
    }, {
        title: 'pagesize',
        value: '20'
    }, {
        title: 'page',
        value: '1'
    }, {
        title: 'attributes',
        value: ''
    }, {
        title: 'sorted',
        value: ''
    }];

    public fragmentModalOpened = false;

    constructor(public http: HttpClient) {
        super(http);
    }

    getFragments() {
        return this.get('/fragment/list', this.filters);
    }

    getFragment(id) {
        return this.get('/fragment/info', [{title: 'id', value: id}]);
    }

    findParam(name) {
        return this.filters.find(param => param.title === name);
    }

    deleteFragment(data) {
        return this.post('/fragment/delete', data);
    }
}
