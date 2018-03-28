import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class BaseApi {
    private baseUrl = location.origin === 'http://localhost:4200' ? 'http://dev.splicer.org' : location.origin;
    constructor (public http: HttpClient) {}

    private generateUrl(url: string = '') {
        return this.baseUrl + url + '&token=' + localStorage.getItem('token');
    }

    public post(url: string = '', data: any = {}): Observable<any> {
        if (localStorage.getItem('token') != null) {
            data.token = localStorage.getItem('token');
        }
        return this.http.post(this.baseUrl + url, data);
    }

    public get(url: string = '', params: any = {}): Observable<any> {
        let requestString = '';
        for (const param of params) {
            if (param.value !== '') {
                requestString += '&' + param.title + '=' + param.value;
            }
        }
        return this.http.get(this.generateUrl(url + '?' + requestString));
    }

    // VideoGetter
    public getVideo(url: string, params: any = {}): Observable<any> {
        let requestString = '';
        for (const param of params) {
            if (param.value !== '') {
                requestString += '&' + param.title + '=' + param.value;
            }
        }

        const headers = new HttpHeaders();
        const options: {
            headers?: HttpHeaders,
            observe?: 'body',
            reportProgress?: boolean,
            responseType: 'blob',
            withCredentials?: boolean
        } = {
            headers: headers,
            responseType: 'blob'
        };
        // const options { headers: HttpHeaders, responseType: 'text',} = { headers: headers, responseType: "blob" };
        return this.http.get(this.generateUrl(url + '?' + requestString), options);
    }

    public postRegister(url: string = '', data: any = {}): Observable<any> {
        return this.http.post(this.baseUrl + url, data);
    }
}
