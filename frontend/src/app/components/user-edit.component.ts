import { Component, OnInit} from "@angular/core"

import { UserService } from "../services/user.service"
import { User } from "../models/user"

@Component({
  selector: "user-edit",
  templateUrl: "../views/user-edit.html",
  providers: [UserService]
})

export class UserEditComponent implements OnInit{
  public titulo: string;
  public user:User;
  public identity;
  public token;
  public updateFormMessage;

  constructor(private _userService:UserService){
    this.titulo = "Actualizar mis datos";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();

    this.user = this.identity;
  }

  ngOnInit(){

  }

  update(){
    let success = function () {
      localStorage.setItem("identity", JSON.stringify(this.user));
      this.updateFormMessage = "El usuario se ha actualizado correctamente";
    };

    let error = function (error) {
      let errorMessage = <any>error;
      if(errorMessage){
        this.updateFormMessage = JSON.parse(errorMessage._body).message;
      }
    };
    this._userService.update(this.user).subscribe(success.bind(this), error.bind(this));
  }

}
