import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class AccountService  {
    constructor(private http: Http) { }

    get(): Observable<any> {
        console.log('In Account Service')
        return this.http.get('account')
            .map(
                (res: Response) => res.json());
    }

    save(account: any): Observable<Response> {
        return this.http.post('uaa/api/account', account);
    }
}
