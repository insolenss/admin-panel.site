import {BaseApi} from '../base-api';
import {Injectable} from '@angular/core';

@Injectable()
export class UploadService extends BaseApi {
    filters = [{
        title: 'pagesize',
        value: 1000
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

    public getThread(id) {
        return this.get('/upload/info', [{title: 'id', value: id}]);
    }

    public getThreadLogs(id, page = 1, statuses = []) {
        const data = [{
            title: 'id',
            value: id
        }, {
            title: 'pagesize',
            value: 1000
        }, {
            title: 'page',
            value: page
        }];
        if (statuses.length) {
            const obj = {
                title: 'status',
                value: statuses.join(',')
            };
            data.push(obj);
        }
        return this.get('/upload/logs', data);
    }

    public startThread(data) {
        return this.post('/upload/start', data);
    }

    public stopThread(id) {
        const data = {id: id};
        return this.post('/upload/stop', data);
    }

    public rerunThread(id) {
        const data = {id: id};
        return this.post('/upload/rerun', data);
    }

    public deleteThread(id) {
        const data = {id: id};
        return this.post('/upload/delete', data);
    }

    public findParam(name) {
        return this.filters.find(param => param.title === name);
    }
}
