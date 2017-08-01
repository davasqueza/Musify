import { Injectable } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Observable";
import { GLOBAL } from "./global";

@Injectable()
export class UserService{
  public url: string;
  public identity;
  public token;

  constructor(private _http: Http){
    this.url = GLOBAL.url;

  }

  signup(userToLogin, getHash = null){
    if(getHash !== null){
      userToLogin.getHash = getHash;
    }

    let params = JSON.stringify(userToLogin);

    let headers = new Headers({"Content-Type":"application/json"});
    return this._http.post(this.url+"login", params, {headers})
      .map(function (data) {
         return data.json();
      })
  }

  register(userToRegister){
    let params = JSON.stringify(userToRegister);

    let headers = new Headers({"Content-Type":"application/json"});
    return this._http.post(this.url+"saveUser", params, {headers})
      .map(function (data) {
        return data.json();
      })
  }

  getIdentity(){
    let identity = JSON.parse(localStorage.getItem("identity"));
    this.identity = identity ? identity : null;
    return identity;
  }

  getToken(){
    let token = localStorage.getItem("token");
    this.token = token ? token : null;
    return token;
  }
}
