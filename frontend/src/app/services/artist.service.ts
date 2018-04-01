import { Injectable } from "@angular/core";
import {Http, Headers} from "@angular/http";
import "rxjs/add/operator/map";
import { GLOBAL } from "./global";
import {Artist} from "../models/artist";

@Injectable()
export class ArtistService {
  public url: string;

  constructor(private _http: Http) {
    this.url = GLOBAL.url;
  }

  getArtists(token, page){
    let headers = new Headers({
      "Content-Type": "application/json",
      "Authorization": token
    });

    return this._http.get(this.url + "artists/" + page, {headers: headers})
      .map(function (data) {
        return data.json();
      });
  }

  getArtist(token, id: string){
    let headers = new Headers({
      "Content-Type": "application/json",
      "Authorization": token
    });

    return this._http.get(this.url + "artist/" + id, {headers: headers})
      .map(function (data) {
        return data.json();
      });
  }

  addArtist(token, artist: Artist){
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

  editArtist(token, id:string , artist: Artist){
    let params = JSON.stringify(artist);
    let headers = new Headers({
      "Content-Type": "application/json",
      "Authorization": token
    });

    return this._http.put(this.url+"artist/" + id, params, {headers: headers})
      .map(function (data) {
        return data.json();
      });
  }

  deleteArtistById(token, id: string){
    let headers = new Headers({
      "Content-Type": "application/json",
      "Authorization": token
    });

    return this._http.delete(this.url + "artist/" + id, {headers: headers})
      .map(function (data) {
        return data.json();
      });
  }
}
