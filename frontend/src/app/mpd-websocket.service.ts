import { Injectable } from "@angular/core";
import { Observable, Observer, AsyncSubject } from 'rxjs';
import { Subject } from 'rxjs';

const WS_URL = "ws://localhost:8000/mpd/ws";

export interface Message {
  source: string;
  content: string;
}

export interface MpdStatus {
  repeat: boolean
  random: boolean
  single: boolean
  consume: boolean
  playlistlength: number
  state: "stop" | "play" | "pause"
  elapsed?: number
  duration?: number
}

export interface MpdCurrentSong {
  album: string
  albumartist: string
  artist: string
  file: string
  title: string
  track: string
  pos: string
  id: string
}

export interface Mpd {
  status?: MpdStatus
  currentsong?: MpdCurrentSong
}

@Injectable({
  providedIn: 'root'
})
export class MpdWebsocketService {
  private ws: WebSocket
  private connected$: AsyncSubject<boolean>
  public mpdStatus$: Subject<Mpd | null>

  constructor() {
    this.connected$ = new AsyncSubject()
    this.ws = new WebSocket(WS_URL)
    this.ws.onopen = (event) => {
      this.connected$.next(true);
      this.connected$.complete()
    }
    this.mpdStatus$ = new Subject<Mpd | null>()
    this.ws.onmessage = (messageEvent: MessageEvent<string>) => {
      this.mpdStatus$.next(this.parseStatus(messageEvent.data))
    }
  }

  send(message: object) {
    this.connected$.subscribe({
      complete: () => { this.ws.send(JSON.stringify(message)) }
    })
  }

  private parseStatus(status_str?: string): Mpd | null {
    if (!status_str) {
      return null;
    }

    let status_obj = JSON.parse(status_str);

    if (!status_obj["status"]) {
      return null;
    }

    return {
      status: {
        repeat: status_obj["status"]["repeat"] == "1",
        random: status_obj["status"]["random"] == "1",
        single: status_obj["status"]["single"] == "1",
        consume: status_obj["status"]["consume"] == "1",
        playlistlength: +status_obj["status"]["playlistlength"],
        state: status_obj["status"]["state"],
        elapsed: status_obj["status"]["elapsed"] != undefined ? +status_obj["status"]["elapsed"] : undefined,
        duration: status_obj["status"]["duration"] != undefined ? +status_obj["status"]["duration"] : undefined,
      },
      currentsong: status_obj["currentsong"]
    }
  }
}