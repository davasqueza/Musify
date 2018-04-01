import { Component, OnInit} from "@angular/core"
import {ActivatedRoute, Params, Router} from "@angular/router"

import { GLOBAL } from "../services/global"
import { UserService } from "../services/user.service"
import { UploadService } from "../services/upload.service"
import { ArtistService } from "../services/artist.service"
import { Artist } from "../models/artist"

@Component({
  selector: "artist-edit",
  templateUrl: "../views/artist-edit.html",
  providers: [UserService, ArtistService, UploadService]
})

export class ArtistEditComponent implements  OnInit {
  public titulo: string;
  public artist: Artist;
  public identity;
  public token;
  public url: string;
  public editArtistFormMessage;
  public filesToUpload: Array<File>;
  public isEdit = true;

  constructor(private _route: ActivatedRoute, private _router: Router, private _userService: UserService,
              private _artistService: ArtistService, private _uploadService: UploadService){
    this.titulo = "Editar artista";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.artist = new Artist("","","","");
  }

  ngOnInit(){
    console.log("Editar artista");

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

  onSubmit(){
    let error = function (error) {
      let errorMessage = <any>error;
      if(errorMessage){
        this.editArtistFormMessage = JSON.parse(errorMessage._body).message;
      }
    };

    this._route.params.forEach(function (params: Params) {
      let id = params['id'];
      let token = this.token;

      let success = function () {
        this.editArtistFormMessage = "Artista editado con éxito";

        if(!this.filesToUpload){
          this._router.navigate(["/artistas",1]);
          return;
        }

        this._uploadService.makeFileRequest(this.url + "uploadArtistImage/"+id, this.filesToUpload, token, "image")
          .then(function () {
            this._router.navigate(["/artistas",1]);
          }.bind(this), error.bind(this));
      };

      this._artistService.editArtist(this.token, id, this.artist).subscribe(success.bind(this), error.bind(this));
    }.bind(this));
  }

  fileChangeEvent(fileInput){
    this.filesToUpload = <Array<File>> fileInput.target.files;

  }
}
