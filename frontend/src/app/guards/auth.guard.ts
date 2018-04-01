import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import {UserService} from "../services/user.service";

@Injectable()
export class IsAdminGuard implements CanActivate {
  constructor(private _userService: UserService, private _router: Router){}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if(!this._userService.isAdmin()){
      this._router.navigate(["/prohibido"]);
      return false;
    }
    return true;
  }
}
