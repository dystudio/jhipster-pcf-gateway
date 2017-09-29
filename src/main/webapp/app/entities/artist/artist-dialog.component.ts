import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Artist } from './artist.model';
import { ArtistPopupService } from './artist-popup.service';
import { ArtistService } from './artist.service';

@Component({
    selector: 'jhi-artist-dialog',
    templateUrl: './artist-dialog.component.html'
})
export class ArtistDialogComponent implements OnInit {

    artist: Artist;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private artistService: ArtistService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.artist.id !== undefined) {
            this.subscribeToSaveResponse(
                this.artistService.update(this.artist));
        } else {
            this.subscribeToSaveResponse(
                this.artistService.create(this.artist));
        }
    }

    private subscribeToSaveResponse(result: Observable<Artist>) {
        result.subscribe((res: Artist) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: Artist) {
        this.eventManager.broadcast({ name: 'artistListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError(error) {
        try {
            error.json();
        } catch (exception) {
            error.message = error.text();
        }
        this.isSaving = false;
        this.onError(error);
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }
}

@Component({
    selector: 'jhi-artist-popup',
    template: ''
})
export class ArtistPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private artistPopupService: ArtistPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.artistPopupService
                    .open(ArtistDialogComponent as Component, params['id']);
            } else {
                this.artistPopupService
                    .open(ArtistDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
