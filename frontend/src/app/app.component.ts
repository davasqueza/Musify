import { Component, OnInit } from '@angular/core';
import { UserService } from "./services/user.service";
import { AppService } from "./app.service";
import { User } from "./models/user";
import { GLOBAL } from "./services/global";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService, AppService]
})
export class AppComponent implements OnInit{
  public title = 'Musify!';
  public user: User;
  public userRegistered: User;
  public identity;
  public token: string;
  public loginFormMessage: string;
  public registerFormMessage: string;
  public url;

  constructor(private _userService:UserService, private _appService:AppService){
    this.user = new User("","","","","","ROLE_USER","");
    this.userRegistered = new User("","","","","","ROLE_USER","");
    this._appService.reloadUserData.subscribe(this.reloadUserData.bind(this));
    this.url = GLOBAL.url;
  }

  ngOnInit(){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  public login(){
    let success = function (response) {
      this.identity = response.user;

      if(!this.identity._id) {
        console.log("No user returned");
      }
      else {
        localStorage.setItem("identity", JSON.stringify(this.identity));
        this.getToken(this.user);
        this.user = new User("","","","","","ROLE_USER","");
      }
    };

    let error = function (error) {
      let errorMessage = <any>error;
      if(errorMessage){
        this.registerFormMessage = JSON.parse(errorMessage._body).message;
      }
    };

    this._userService.signup(this.user).subscribe(success.bind(this), error.bind(this));
  }

  private getToken(user:User){
    let success = function (response) {
      this.token = response.token;
      if(this.token.length <= 0) {
        console.log("The token wasn't generated");
      }
      else {
        localStorage.setItem("token", this.token);
      }
    };

    let error = function (error) {
      let errorMessage = <any>error;
      if(errorMessage){
        this.loginFormMessage = JSON.parse(errorMessage._body).message;
      }
    };

    this._userService.signup(user, "true").subscribe(success.bind(this), error.bind(this));
  }

  public register(){
    let success = function (response) {
      if(!response.user._id) {
        this.registerFormMessage = "Error en el registro";
      }
      else {
        this.registerFormMessage = "Usuario registrado correctamente: " + response.user.name;
        this.userRegistered = new User("","","","","","ROLE_USER","");
      }
    };

    let error = function (error) {
      let errorMessage = <any>error;
      if(errorMessage){
        this.registerFormMessage = JSON.parse(errorMessage._body).message;
      }
    };

    this._userService.register(this.userRegistered).subscribe(success.bind(this), error.bind(this));
  }

  public logout(){
    localStorage.removeItem("identity");
    localStorage.removeItem("token");
    this.identity = null;
    this.token = null;
  }

  public reloadUserData(){
    console.log("update data");
    this.identity = this._userService.getIdentity();
  }
}
