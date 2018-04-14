import { Subject } from 'rxjs/Subject';

export class UserParamsService {
    public searchUser = '';
    public searchUserSubject = new Subject();

    public searchFragment = '';

    public searchTag = '';

    public searchSplice = '';

    public userName = '';

    public isAdmin() {
        return localStorage.getItem('access_level') === 'admin';
    }

    public isModerator() {
        return localStorage.getItem('access_level') === 'moderator';
    }

    public setAccessLevel(accessLevel) {
        localStorage.setItem('access_level', accessLevel);
    }

    public getAccessLevel() {
        return localStorage.getItem('access_level');
    }

    public clear() {
        this.searchUser = '';
        this.searchFragment = '';
        this.searchTag = '';
        this.searchSplice = '';
        this.searchUserSubject.next('');
    }

    public updateParam(param, id) {
        switch (param) {
            case 'user':
                this.searchUser = this.searchUser === id ? '' : id;
                this.searchFragment = '';
                this.searchTag = '';
                this.searchSplice = '';
                break;
            case 'fragment':
                this.searchUser = '';
                this.searchFragment = this.searchFragment === id ? '' : id;
                this.searchTag = '';
                this.searchSplice = '';
                break;
            case 'tag':
                this.searchUser = '';
                this.searchFragment = '';
                this.searchTag = this.searchTag === id ? '' : id;
                this.searchSplice = '';
                break;
            case 'splice':
                this.searchUser = '';
                this.searchFragment = '';
                this.searchTag = '';
                this.searchSplice = this.searchSplice === id ? '' : id;
                break;
        }

        this.searchUserSubject.next('');
    }
}
