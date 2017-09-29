import { BaseEntity } from './../../shared';

export class Album implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public year?: number,
        public artist?: BaseEntity,
    ) {
    }
}
