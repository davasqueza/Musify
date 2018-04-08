import { Component, OnInit} from "@angular/core"

import { GLOBAL } from "../services/global"
import { UserService } from "../services/user.service"
import { Artist } from "../models/artist"
import {ActivatedRoute, Params} from "@angular/router";
import {ArtistService} from "../services/artist.service";

@Component({
  selector: "artist-list",
  templateUrl: "../views/artist-list.html",
  providers: [UserService, ArtistService]
})

export class ArtistListComponent implements  OnInit {
  public titulo: string;
  public artists: Artist[];
  public identity;
  public token;
  public url: string;
  public next_page;
  public prev_page;
  public isAdmin;
  public listArtistMessage;
  public showDeleteSection;

  constructor(private _route: ActivatedRoute, private _userService: UserService, private _artistService: ArtistService){
    this.titulo = "Artistas";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;

    this.next_page = 1;
    this.prev_page = 1;
    this.isAdmin = _userService.isAdmin();
  }

  ngOnInit(){
    console.log("Listado de artistas");
    this.getArtists();
  }

  getArtists(){
    this._route.params.forEach(function (params: Params) {
      let page = params['page'];

      page = page ? Number(page) : 1;

      this.next_page = page + 1;
      this.prev_page = page - 1;

      this.prev_page = this.prev_page !== 0 ? this.prev_page : 1;

      let success = function (response) {
        if(!response.artists){
          this._router.navigate(["/"]);
        }
        else{
          this.artists = response.artists;
        }
      };

      let error = function (error) {
        let errorMessage = <any>error;
        if(errorMessage){
          this.listArtistMessage = JSON.parse(errorMessage._body).message;
        }
      };

      this._artistService.getArtists(this.token, page).subscribe(success.bind(this), error.bind(this));
    }.bind(this));
  }

  onDeleteConfirm(id){
    this.showDeleteSection = id;
  }

  onCancel(){
    this.showDeleteSection = null;
  }

  onDeleteArtist(id){
    let error = function (error) {
      let errorMessage = <any>error;
      if(errorMessage){
        this.listArtistMessage = JSON.parse(errorMessage._body).message;
      }
    };

    this._artistService.deleteArtistById(this.token, id).subscribe(this.getArtists.bind(this), error.bind(this));
  }
}
