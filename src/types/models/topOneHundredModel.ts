import { IsDefined } from 'class-validator';
export interface TopOneHundredPost {
    artist: string;
    artistType: string;
    album: string;
    releaseYear: string;
    isFavorite: boolean;
}
export interface TopOneHundredPut {
topOneHundredId: string;
artist: string;
artistType: string;
album: string;
releaseYear: string;
isFavorite: boolean;
}
export interface TopOneHundredResponse {

    topOneHundredId: string;
    artist: string;
    artistType: string;
    album: string;
    releaseYear: string;
    isFavorite: boolean;
    response: any;
}

export class TopOneHundred {
    @IsDefined()
    topOneHundredId: string;

    artist: string;
    artistType: string;
    album: string;
    releaseYear: string;
    isFavorite: boolean;

    constructor(data: Partial<TopOneHundred | TopOneHundredPut>) {
      this.topOneHundredId = data.topOneHundredId;
      this.artist = data.artist;
      this.artistType = data.artistType;
      this.album = data.album;
      this.releaseYear = data.releaseYear;
      this.isFavorite = data.isFavorite;
    }
}
