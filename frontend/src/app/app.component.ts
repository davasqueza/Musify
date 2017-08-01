import { Component, OnInit } from '@angular/core';
import { UserService } from "./services/user.service"
import {User} from "./models/user";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})
export class AppComponent implements OnInit{
  public title = 'Musify!';
  public user: User;
  public identity;
  public token;
  public errorMessage;

  constructor(private _userService:UserService){
    this.user = new User("","","","","","ROLE_USER","");
  }

  ngOnInit(){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  public onSubmit(){
    let success = function (response) {
      this.identity = response.user;

      if(!this.identity._id) {
        console.log("No user returned");
      }
      else {
        localStorage.setItem("identity", JSON.stringify(this.identity));
        this.getToken(this.user);
      }
    };

    let error = function (error) {
      let errorMessage = <any>error;
      if(errorMessage){
        this.errorMessage = JSON.parse(errorMessage._body).message;
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
        this.errorMessage = JSON.parse(errorMessage._body).message;
      }
    };

    this._userService.signup(user, "true").subscribe(success.bind(this), error.bind(this));
  }
}
