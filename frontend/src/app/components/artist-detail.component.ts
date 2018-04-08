import { Component, OnInit} from "@angular/core"
import {ActivatedRoute, Params} from "@angular/router"

import { GLOBAL } from "../services/global"
import { UserService } from "../services/user.service"
import { ArtistService } from "../services/artist.service"
import { Artist } from "../models/artist"

@Component({
  selector: "artist-detail",
  templateUrl: "../views/artist-detail.html",
  providers: [UserService, ArtistService]
})

export class ArtistDetailComponent implements  OnInit {
  public titulo: string;
  public artist: Artist;
  public identity;
  public token;
  public url: string;
  public isAdmin;

  constructor(private _route: ActivatedRoute, private _userService: UserService, private _artistService: ArtistService){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.isAdmin = _userService.isAdmin();
  }

  ngOnInit(){
    console.log("Ver artista");

    this.getArtist();
  }

  getArtist(){
    let success = function (response) {
      if(!response.artist){
        this._router.navigate(["/"]);
      }
      else{
        this.artist = response.artist;
      }
    };

    let error = function (error) {
      let errorMessage = <any>error;
      if(errorMessage){
        this.editArtistFormMessage = JSON.parse(errorMessage._body).message;
      }
    };

    this._route.params.forEach(function (params: Params) {
      let id = params['id'];

      this._artistService.getArtist(this.token, id).subscribe(success.bind(this), error.bind(this));
    }.bind(this));
  }
}
