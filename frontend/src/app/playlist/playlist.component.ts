import { Component, OnInit } from '@angular/core';
import { interval, merge, mergeMap, Observable, Subject, tap } from 'rxjs';
import { MpdRestService, Song } from '../mpd-rest.service';
import { Mpd, MpdWebsocketService } from '../mpd-websocket.service';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent implements OnInit {

  playlist$: Observable<Song[]>
  status$: Observable<Mpd | null>
  private refresh$: Subject<void> = new Subject()

  constructor(private mpdRestService: MpdRestService, private mpdWsService: MpdWebsocketService) {
    this.playlist$ = merge(interval(1000), this.refresh$).pipe(
      mergeMap(() => this.mpdRestService.playlistInfo())
    );
    this.status$ = this.mpdWsService.mpdStatus$;
  }

  ngOnInit(): void {
    this.refresh$.next()
  }

  play(pos: string) {
    this.mpdRestService.play(+pos).pipe(tap(() => this.refresh$.next())).subscribe()
  }

  clear() {
    this.mpdRestService.clear().pipe(tap(() => this.refresh$.next())).subscribe()
  }
}
