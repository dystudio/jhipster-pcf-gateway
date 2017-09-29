import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Album } from './album.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class AlbumService {

    private resourceUrl = 'microservices/api/albums';

    constructor(private http: Http) { }

    create(album: Album): Observable<Album> {
        const copy = this.convert(album);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(album: Album): Observable<Album> {
        const copy = this.convert(album);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: number): Observable<Album> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            return res.json();
        });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: Response) => this.convertResponse(res));
    }

    delete(id: number): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }

    private convert(album: Album): Album {
        const copy: Album = Object.assign({}, album);
        return copy;
    }
}
