import { BaseApi } from '../base-api';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class RatingsService extends BaseApi {
    constructor (public http: HttpClient) {
        super(http);
    }

    filters = [{
        title: 'pagesize',
        value: '20'
    }, {
        title: 'page',
        value: '1'
    }];

    findParam(name) {
        return this.filters.find(param => param.title === name);
    }

    getRatings() {
        return this.get('/rating/list', this.filters);
    }

    deleteRating(id) {
        return this.post('/rating/delete', {id: id});
    }
}
