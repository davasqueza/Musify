import { ModuleWithProviders } from "@angular/core";
import { RouterModule, Routes} from "@angular/router";

import { UserEditComponent } from "./components/user-edit.component"
import  { HomeComponent } from "./components/home.component"
import  { ArtistListComponent } from "./components/artist-list.component"
import  { ArtistAddComponent } from "./components/artist-add.component"

const appRoutes: Routes = [
  {path: "", component: HomeComponent},
  {path: "crear-artista", component: ArtistAddComponent},
  {path: "artistas/:page", component: ArtistListComponent},
  {path: "mis-datos", component: UserEditComponent},
  {path: "**", component: HomeComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
