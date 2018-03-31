import { Component, OnInit} from "@angular/core"
import { Router } from "@angular/router"

import { GLOBAL } from "../services/global"
import { UserService } from "../services/user.service"
import { ArtistService } from "../services/artist.service"
import { Artist } from "../models/artist"

@Component({
  selector: "artist-add",
  templateUrl: "../views/artist-add.html",
  providers: [UserService, ArtistService]
})

export class ArtistAddComponent implements  OnInit {
  public titulo: string;
  public artist: Artist;
  public identity;
  public token;
  public url: string;
  public addArtistFormMessage;

  constructor(private _router: Router, private _userService: UserService, private _artistService: ArtistService){
    this.titulo = "Crear nuevo artista";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.artist = new Artist("","","","");
  }

  ngOnInit(){
    console.log("Crear artista");
  }

  onSubmit(){
    let success = function (response) {

      if(!response.artist){
        this.addArtistFormMessage = "Error en el servidor";
      }
      else {
        this.artist = response.artist;
        this._router.navigate(["/editar-artista"], response.artist._id);

        this.addArtistFormMessage = "Artista creado con éxito";
      }
    };

    let error = function (error) {
      let errorMessage = <any>error;
      if(errorMessage){
        this.addArtistFormMessage = JSON.parse(errorMessage._body).message;
      }
    };

    this._artistService.addArtist(this.token, this.artist).subscribe(success.bind(this), error.bind(this));
  }
}
