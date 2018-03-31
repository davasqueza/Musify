import { Component, OnInit} from "@angular/core"
import { Router, ActivatedRoute } from "@angular/router"

@Component({
  selector: "home",
  templateUrl: "../views/home.html",
  providers: []
})

export class HomeComponent implements  OnInit {
  public titulo: string;

  constructor( private _route: ActivatedRoute, private _router: Router){
    this.titulo = "Artistas";
  }

  ngOnInit(){
    console.log("Inicio");
  }
}
