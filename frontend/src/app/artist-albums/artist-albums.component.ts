import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, mergeMap, Observable, tap } from 'rxjs';
import { ArtistAlbums, MpdRestService } from '../mpd-rest.service';

@Component({
  selector: 'app-artist-albums',
  templateUrl: './artist-albums.component.html',
  styleUrls: ['./artist-albums.component.scss']
})
export class ArtistAlbumsComponent implements OnInit {

  albums: ArtistAlbums | null = null
  covers: { [album: string]: Observable<string> } = {}

  constructor(private activatedRoute: ActivatedRoute, private mpdRestService: MpdRestService) {

  }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(
      map(p => p["artist"]),
      mergeMap((artist: string) => this.mpdRestService.getAlbums(artist)),
      tap((albums) => {
        for (let album of albums.albums) {
          this.covers[album.album] = this.mpdRestService.getSongs(albums.artist, album.album).pipe(
            map(songs => songs[0]),
            mergeMap(song => this.mpdRestService.getCover(song.file)),
            map(cover => cover ? `data:image/png;base64, ${cover.cover}` : "assets/img/cover.png"),
          )
        }
      })
    ).subscribe(
      (albums) => { this.albums = albums }
    )
  }

  play(artist: string, album: string) {
    this.mpdRestService.clear().pipe(
      mergeMap(() => this.mpdRestService.enqueueAlbum(artist, album)),
      mergeMap(() => this.mpdRestService.play(0)),
    ).subscribe()
  }

  enqueue(artist: string, album: string) {
    this.mpdRestService.enqueueAlbum(artist, album).subscribe()
  }

}
