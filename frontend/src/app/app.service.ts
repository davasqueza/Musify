import { Subject } from "rxjs/Subject"
import {Injectable} from "@angular/core";

@Injectable()
export class AppService{
  public reloadUserData:Subject<null> = new Subject();

  public emitReloadUser(){
    this.reloadUserData.next();
  }
}
