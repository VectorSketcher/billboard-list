export interface TopOneHundredPost {
    artist: string;
    artistType: string;
    album: string;
    releaseYear: Date;
    favorite: boolean;
}
export interface TopOneHundredResponse {
    topOneHundredId: string;
    artist: string;
    artistType: string;
    album: string;
    releaseYear: Date;
    favorite: boolean;
    response: any;
}

export class TopOneHundred {
    topOneHundredId: string;
    artist: string;
    artistType: string;
    album: string;
    releaseYear: string;
    favorite: boolean;

    constructor(data: TopOneHundred) {
      this.topOneHundredId = data.topOneHundredId;
      this.artist = data.artist;
      this.artistType = data.artistType;
      this.album = data.album;
      this.releaseYear = data.releaseYear;
      this.favorite = data.favorite;
    }
}
