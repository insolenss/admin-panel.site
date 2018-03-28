import {BaseApi} from '../base-api';
import {Injectable} from '@angular/core';

@Injectable()
export class UploadService extends BaseApi {
    filters = [{
        title: 'pagesize',
        value: 500
    }, {
        title: 'page',
        value: 1
    }, {
        title: 'status',
        value: 'STARTED,IN_WORK,NEED_STOP,STOPED,COMPLITED,DEATH'
    }];

    public getThreads() {
        return this.get('/upload/list', this.filters);
    }
}
