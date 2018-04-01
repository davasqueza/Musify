import { Component, OnInit} from "@angular/core"

import { AppService } from "../app.service"
import { UserService } from "../services/user.service"
import { User } from "../models/user"
import { GLOBAL } from "../services/global"
import {UploadService} from "../services/upload.service";

@Component({
  selector: "user-edit",
  templateUrl: "../views/user-edit.html",
  providers: [UserService, UploadService]
})

export class UserEditComponent implements OnInit{
  public titulo: string;
  public user:User;
  public identity;
  public token;
  public updateFormMessage;
  public filesToUpload: Array<File>;
  public url: string;

  constructor(private _userService:UserService, private _appService:AppService, private _uploadService: UploadService){
    this.titulo = "Actualizar mis datos";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();

    this.user = this.identity;
    this.url = GLOBAL.url;
  }

  ngOnInit(){

  }

  update(){
    let success = function () {
      localStorage.setItem("identity", JSON.stringify(this.user));
      if(!this.filesToUpload){
        this._appService.emitReloadUser();
      }
      else{
        this._uploadService.makeFileRequest(this.url + "uploadUserImage/"+this.user._id, this.filesToUpload, this.token, "image")
          .then(this.updateUserImage.bind(this));
      }

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

  updateUserImage(result){
    this.user.image = result.image;
    localStorage.setItem("identity", JSON.stringify(this.user));
    this._appService.emitReloadUser();
  }

  fileChangeEvent(fileInput){
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }
}
