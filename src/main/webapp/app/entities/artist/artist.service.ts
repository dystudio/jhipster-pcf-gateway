import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Artist } from './artist.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class ArtistService {

    private resourceUrl = 'microservices/api/artists';

    constructor(private http: Http) { }

    create(artist: Artist): Observable<Artist> {
        const copy = this.convert(artist);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(artist: Artist): Observable<Artist> {
        const copy = this.convert(artist);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: number): Observable<Artist> {
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

    private convert(artist: Artist): Artist {
        const copy: Artist = Object.assign({}, artist);
        return copy;
    }
}
