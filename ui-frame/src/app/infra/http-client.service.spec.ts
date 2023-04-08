import {TestBed} from '@angular/core/testing';

import {HttpClientService} from './http-client.service';
import {HttpClient, HttpClientModule, HttpHeaders} from '@angular/common/http';

describe('HttpClientService', () => {
    let service: HttpClientService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
            ],
            providers: [
                HttpClient,
            ],
        });
        service = TestBed.inject(HttpClientService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('post', () => {
        const headers = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            })
        };
        const url = 'https://example.com';
        service.post(headers, url, {});
    });

    it('get', () => {
        const headers = {headers: new HttpHeaders({})};
        const url = 'https://example.com';
        service.get(headers, url,);
    });
});
