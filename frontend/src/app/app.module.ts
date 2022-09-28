import { HttpClientModule } from '@angular/common/http';
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ClarityModule } from "@clr/angular";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from "./app.component";
import { ArtistsComponent } from './artists/artists.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { PlaylistsComponent } from './playlists/playlists.component';
import { ControlBarComponent } from './control-bar/control-bar.component';
import { ArtistAlbumsComponent } from './artist-albums/artist-albums.component';

@NgModule({
  declarations: [
    AppComponent,
    ArtistsComponent,
    PlaylistComponent,
    PlaylistsComponent,
    ControlBarComponent,
    ArtistAlbumsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ClarityModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
