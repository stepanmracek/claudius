import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { MpdRestService, Song } from '../mpd-rest.service';
import { Mpd, MpdWebsocketService } from '../mpd-websocket.service';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent {

  playlist$: Observable<Song[]>
  status$: Observable<Mpd | null>

  constructor(private mpdRestService: MpdRestService, private mpdWsService: MpdWebsocketService) {
    this.playlist$ = this.mpdRestService.playlistInfo()
    this.status$ = this.mpdWsService.mpdStatus$
  }

  play(pos: string) {
    this.mpdRestService.play(+pos).subscribe()
  }
}
