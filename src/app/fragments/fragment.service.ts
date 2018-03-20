import { BaseApi } from '../base-api';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable()
export class FragmentService extends BaseApi {
    constructor (public http: HttpClient) {
        super(http);
    }

    public getFragment(id) {
        return this.get('/fragment/info', [{title: 'id', value: id}]);
    }

    public getStream(id) {
        return this.getVideo('/fragment/stream', [{title: 'id', value: id}]);
    }

    public getTagName(id) {
        return this.get('/tag/info', [{title: 'id', value: id}]);
    }

    public saveAttributes(data) {
        return this.post('/fragment/update/attributes', data);
    }

    public makeGlobal(data) {
        return this.post('/fragment/globalise', data);
    }

    public makeAttestation(data) {
        return this.post('/fragment/publish', data);
    }

    public makePrivate(data) {
        return this.post('/fragment/private', data);
    }

    public changeOwner(data) {
        return this.post('/fragment/chown', data);
    }
}
