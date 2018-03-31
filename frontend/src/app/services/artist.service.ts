import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";
import "rxjs/add/operator/map";
import { GLOBAL } from "./global";

@Injectable()
export class ArtistService {
  public url: string;

  constructor(private _http: Http) {
    this.url = GLOBAL.url;
  }

  addArtist(token, artist){
    let params = JSON.stringify(artist);
    let headers = new Headers({
      "Content-Type": "application/json",
      "Authorization": token
    });

    return this._http.post(this.url+"artist", params, {headers: headers})
      .map(function (data) {
        return data.json();
      });
  }
}
