import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { ArtistComponent } from './artist.component';
import { ArtistDetailComponent } from './artist-detail.component';
import { ArtistPopupComponent } from './artist-dialog.component';
import { ArtistDeletePopupComponent } from './artist-delete-dialog.component';

export const artistRoute: Routes = [
    {
        path: 'artist',
        component: ArtistComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Artists'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'artist/:id',
        component: ArtistDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Artists'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const artistPopupRoute: Routes = [
    {
        path: 'artist-new',
        component: ArtistPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Artists'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'artist/:id/edit',
        component: ArtistPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Artists'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'artist/:id/delete',
        component: ArtistDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Artists'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
