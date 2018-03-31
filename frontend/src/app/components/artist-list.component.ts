import { Component, OnInit} from "@angular/core"

import { GLOBAL } from "../services/global"
import { UserService } from "../services/user.service"
import { Artist } from "../models/artist"

@Component({
  selector: "artist-list",
  templateUrl: "../views/artist-list.html",
  providers: [UserService]
})

export class ArtistListComponent implements  OnInit {
  public titulo: string;
  public artist: Artist[];
  public identity;
  public token;
  public url: string;

  constructor(private _userService: UserService){
    this.titulo = "Artistas";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
  }

  ngOnInit(){
    console.log("Listado de artistas");
  }
}
