import { Component, OnInit} from "@angular/core"
import {ActivatedRoute, Params} from "@angular/router"

import { GLOBAL } from "../services/global"
import { UserService } from "../services/user.service"
import {Album} from "../models/album";
import {AlbumService} from "../services/album.service";

@Component({
  selector: "album-add",
  templateUrl: "../views/album-add.html",
  providers: [UserService, AlbumService]
})

export class AlbumAddComponent implements  OnInit {
  public titulo: string;
  public album: Album;
  public identity;
  public token;
  public url: string;
  public addFormMessage;

  constructor(private _route: ActivatedRoute, private _userService: UserService, private _albumService: AlbumService) {
    this.titulo = "Crear nuevo album";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.album = new Album("", "", new Date().getFullYear(), "", "");
  }

  ngOnInit(){
    console.log("Agregar album");
  }

  onSubmit(){
    this._route.params.forEach(function (params: Params) {
      this.album.artist = params['id'];

      let success = function (response) {

        if(!response.album){
          this.addFormMessage = "Error en el servidor";
        }
        else {
          this.album = response.album;
          this._router.navigate(["/editar-album", response.album._id]);

          this.addFormMessage = "Album creado con éxito";
        }
      };

      let error = function (error) {
        let errorMessage = <any>error;
        if(errorMessage){
          this.addFormMessage = JSON.parse(errorMessage._body).message;
        }
      };

      this._albumService.addAlbum(this.token, this.album).subscribe(success.bind(this), error.bind(this));

    }.bind(this));
  }
}
