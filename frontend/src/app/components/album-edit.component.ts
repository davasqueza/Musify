import { Component, OnInit} from "@angular/core"
import {ActivatedRoute, Params, Router} from "@angular/router"

import { GLOBAL } from "../services/global"
import { UserService } from "../services/user.service"
import {Album} from "../models/album";
import {AlbumService} from "../services/album.service";
import {UploadService} from "../services/upload.service";

@Component({
  selector: "album-edit",
  templateUrl: "../views/album-edit.html",
  providers: [UserService, AlbumService, UploadService]
})

export class AlbumEditComponent implements  OnInit {
  public filesToUpload: File[];
  public titulo: string;
  public album: Album;
  public identity;
  public token;
  public url: string;
  public editFormMessage;
  public isEdit;

  constructor(private _route: ActivatedRoute, private _userService: UserService, private _albumService: AlbumService,
              private _uploadService: UploadService, private _router: Router) {
    this.titulo = "Editar album";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.album = new Album("", "", new Date().getFullYear(), "", "");
    this.isEdit = true;
  }

  ngOnInit(){
    console.log("Editar album");

    this.getAlbum();
  }

  getAlbum(){
    this._route.params.forEach(function (params: Params) {
      let id = params['id'];

      let success = function (response) {

        if(!response.album){
          this.editFormMessage = "Error en el servidor";
        }
        else {
          this.album = response.album;
        }
      };

      let error = function (error) {
        let errorMessage = <any>error;
        if(errorMessage){
          this.editFormMessage = JSON.parse(errorMessage._body).message;
        }
      };

      this._albumService.getAlbum(this.token, id).subscribe(success.bind(this), error.bind(this));
    }.bind(this));
  }

  onSubmit(){
    this._route.params.forEach(function (params: Params) {
      let id = params['id'];
      let token = this.token;

      let success = function () {
        this.editArtistFormMessage = "Artista editado con éxito";

        if(!this.filesToUpload){
          this._router.navigate(["/artista", this.album.artist]);
          return;
        }

        this._uploadService.makeFileRequest(this.url + "uploadAlbumImage/"+id, this.filesToUpload, token, "image")
          .then(function () {
            this._router.navigate(["/artista", this.album.artist]);
          }.bind(this), error.bind(this));
      };

      let error = function (error) {
        let errorMessage = <any>error;
        if(errorMessage){
          this.editFormMessage = JSON.parse(errorMessage._body).message;
        }
      };

      this._albumService.editAlbum(this.token, id, this.album).subscribe(success.bind(this), error.bind(this));

    }.bind(this));
  }

  fileChangeEvent(fileInput){
    this.filesToUpload = <Array<File>> fileInput.target.files;

  }
}
