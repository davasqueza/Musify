import { Component, OnInit} from "@angular/core"
import {UserService} from "../services/user.service";

@Component({
  selector: "forbidden",
  templateUrl: "../views/forbidden.html",
  providers: []
})

export class ForbiddenComponent implements  OnInit {
  public identity;

  constructor( private _userService:UserService){
    this.identity = this._userService.getIdentity();
  }

  ngOnInit(){
    console.log("Acceso prohibido: ", this.identity);
  }
}
