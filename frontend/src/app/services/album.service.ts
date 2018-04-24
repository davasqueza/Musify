///<reference path="../../../node_modules/@types/node/index.d.ts"/>
import { Injectable } from "@angular/core";
import {Http, Headers, RequestOptions} from "@angular/http";
import "rxjs/add/operator/map";
import { GLOBAL } from "./global";
import {Album} from "../models/album";

@Injectable()
export class AlbumService {
  public url: string;

  constructor(private _http: Http) {
    this.url = GLOBAL.url;
  }

  getAlbum(token, id: string){
    let headers = new Headers({
      "Content-Type": "application/json",
      "Authorization": token
    });

    let options = new RequestOptions({headers: headers});

    return this._http.get(this.url + "album/" + id, options)
      .map(function (data) {
        return data.json();
      });
  }

  addAlbum(token, album: Album){
    let params = JSON.stringify(album);
    let headers = new Headers({
      "Content-Type": "application/json",
      "Authorization": token
    });

    return this._http.post(this.url+"album", params, {headers: headers})
      .map(function (data) {
        return data.json();
      });
  }

  editAlbum(token, id: string, album: Album){
    let params = JSON.stringify(album);
    let headers = new Headers({
      "Content-Type": "application/json",
      "Authorization": token
    });

    let options = new RequestOptions({headers: headers});

    return this._http.put(this.url + "album/" + id, params, options)
      .map(function (data) {
        return data.json();
      });
  }

}
