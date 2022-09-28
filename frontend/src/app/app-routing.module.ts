import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArtistAlbumsComponent } from './artist-albums/artist-albums.component';
import { ArtistsComponent } from './artists/artists.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { PlaylistsComponent } from './playlists/playlists.component';

const routes: Routes = [
  { path: "artists", component: ArtistsComponent },
  { path: "playlist", component: PlaylistComponent },
  { path: "playlists", component: PlaylistsComponent },
  { path: "artist-albums/:artist", component: ArtistAlbumsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
