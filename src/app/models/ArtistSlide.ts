import { Customer } from '../models/Customer';

export interface ArtistSlide {
    artists: Customer[],
    index: number
}