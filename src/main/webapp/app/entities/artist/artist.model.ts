import { BaseEntity } from './../../shared';

export class Artist implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public dob?: number,
    ) {
    }
}
