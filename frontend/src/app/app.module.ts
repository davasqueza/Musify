import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { UserEditComponent } from "./components/user-edit.component"
import { ArtistListComponent } from "./components/artist-list.component"
import { HomeComponent } from "./components/home.component"
import { ArtistAddComponent} from "./components/artist-add.component"
import { ArtistEditComponent } from "./components/artist-edit.component"
import { IsAdminGuard } from "./guards/auth.guard"

import { routing, appRoutingProviders } from "./app.routing"
import {UserService} from "./services/user.service";
import {ForbiddenComponent} from "./components/forbidden.component";
import {ArtistDetailComponent} from "./components/artist-detail.component";
import {AlbumAddComponent} from "./components/album-add.component";
import {AlbumService} from "./services/album.service";

@NgModule({
  declarations: [
    AppComponent,
    UserEditComponent,
    ArtistListComponent,
    HomeComponent,
    ArtistAddComponent,
    ArtistEditComponent,
    ForbiddenComponent,
    ArtistDetailComponent,
    AlbumAddComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [
    appRoutingProviders,
    IsAdminGuard,
    UserService,
    AlbumService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
