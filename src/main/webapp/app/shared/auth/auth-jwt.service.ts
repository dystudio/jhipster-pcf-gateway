import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { LocalStorageService, SessionStorageService } from 'ng2-webstorage';

@Injectable()
export class AuthServerProvider {

    private authEndpoint: string;
    private authHeaderValue: string;

    constructor(
        private http: Http,
        private $localStorage: LocalStorageService,
        private $sessionStorage: SessionStorageService
    ) {
        this.init();
    }

    init() {
        this.http.get('/authdetails').toPromise().then((res) => {
            const resObj = res.json();
            console.log('got auth details');
            console.log(resObj);
            this.authEndpoint = resObj.authEndpoint;
            this.authHeaderValue = resObj.authHeaderValue;

        }).catch((err) => Promise.reject('unable to get auth details from server: ' + err));
    }

    getToken() {
        return this.$localStorage.retrieve('authenticationToken') || this.$sessionStorage.retrieve('authenticationToken');
    }

    login(credentials): Observable<any> {
        const data = new URLSearchParams();
        data.append('grant_type', 'password');
        data.append('username', credentials.username);
        data.append('password', credentials.password);

        const headers = new Headers ({
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization' : 'Basic ' + this.authHeaderValue
        });

        return this.http.post(this.authEndpoint, data, {
            headers
        }).map((resp) => {
            const accessToken = resp.json()['access_token'];
            if (accessToken) {
                this.storeAuthenticationToken(accessToken, credentials.rememberMe);
            }

            return accessToken;
        });
    }

    loginWithToken(jwt, rememberMe) {
        if (jwt) {
            this.storeAuthenticationToken(jwt, rememberMe);
            return Promise.resolve(jwt);
        } else {
            return Promise.reject('auth-jwt-service Promise reject'); // Put appropriate error message here
        }
    }

    storeAuthenticationToken(jwt, rememberMe) {
        if (rememberMe) {
            this.$localStorage.store('authenticationToken', jwt);
        } else {
            this.$sessionStorage.store('authenticationToken', jwt);
        }
    }

    logout(): Observable<any> {
        return new Observable((observer) => {
            this.$localStorage.clear('authenticationToken');
            this.$sessionStorage.clear('authenticationToken');
            observer.complete();
        });
    }
}
