import { ModuleWithProviders } from "@angular/core";
import { RouterModule, Routes} from "@angular/router";

import { UserEditComponent } from "./components/user-edit.component"
import { HomeComponent } from "./components/home.component"
import { ArtistListComponent } from "./components/artist-list.component"
import { ArtistAddComponent } from "./components/artist-add.component"
import { ArtistEditComponent } from "./components/artist-edit.component"
import {IsAdminGuard} from "./guards/auth.guard";
import {ForbiddenComponent} from "./components/forbidden.component";
import {ArtistDetailComponent} from "./components/artist-detail.component";

const appRoutes: Routes = [
  {path: "", component: HomeComponent},
  {path: "crear-artista", component: ArtistAddComponent, canActivate: [IsAdminGuard]},
  {path: "editar-artista/:id", component: ArtistEditComponent, canActivate: [IsAdminGuard]},
  {path: "artistas/:page", component: ArtistListComponent},
  {path: "mis-datos", component: UserEditComponent},
  {path: "artista/:id", component: ArtistDetailComponent},
  {path: "prohibido", component: ForbiddenComponent},
  {path: "**", component: HomeComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
