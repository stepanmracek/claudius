import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Mpd, MpdWebsocketService } from '../mpd-websocket.service';

@Component({
  selector: 'app-control-bar',
  templateUrl: './control-bar.component.html',
  styleUrls: ['./control-bar.component.scss']
})
export class ControlBarComponent {

  mpd$: Observable<Mpd | null>

  constructor(private mpdWsService: MpdWebsocketService) {
    this.mpd$ = mpdWsService.mpdStatus$
  }

}
