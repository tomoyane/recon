import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {retry} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class HttpClientService {

    constructor(private http: HttpClient) {
    }

    public async post(headers, url, body, execCnt = 0): Promise<any> {
        return await this.http.post(url, body, headers)
            .pipe(retry(execCnt))
            .toPromise()
            .then(result => {
                return result;
            })
            .catch(error => {
                throw error.error;
            });
    }

    public async get(headers, url, execCnt = 0): Promise<any> {
        return await this.http.get(url, headers)
            .pipe(retry(execCnt))
            .toPromise()
            .then(result => {
                return result;
            })
            .catch(error => {
                throw error.error;
            });
    }
}
