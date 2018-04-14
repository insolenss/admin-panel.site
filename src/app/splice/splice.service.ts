import { BaseApi } from '../base-api';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable()
export class SpliceService extends BaseApi {
    constructor (public http: HttpClient) {
        super(http);
    }

    public getSplice(id) {
        return this.get('/splice/info', [{title: 'id', value: id}]);
    }

    public getStream(id) {
        return this.getVideo('/splice/stream', [{title: 'id', value: id}]);
    }

    public deleteSplice(id) {
        return this.post('/splice/delete', [{title: 'id', value: id}]);
    }

    public makeGlobal(data) {
        return this.post('/splice/globalise', data);
    }
}
