import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVICE_URLS } from 'app/app.config';

@Injectable({
    providedIn: 'root',
})
export class MemberService {
    constructor(private _http: HttpClient) {}

    getAll(params: any) {
        return this._http.get([SERVICE_URLS.MEMBER_API, 'list'].join('/'), {
            params,
        });
    }

    findById(id: string) {
        return this._http.get([SERVICE_URLS.MEMBER_API, 'list', id].join('/'));
    }

    create(data: any) {
        return this._http.post(
            [SERVICE_URLS.MEMBER_API, 'create'].join('/'),
            data,
        );
    }

    update(id: string, data: any) {
        return this._http.post(
            [SERVICE_URLS.MEMBER_API, 'update', id].join('/'),
            data,
        );
    }

    remove(id: string) {
        return this._http.post(
            [SERVICE_URLS.MEMBER_API, 'delete', id].join('/'),
            null,
        );
    }
}
