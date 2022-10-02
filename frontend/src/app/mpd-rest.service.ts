import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, mergeMap } from 'rxjs/operators';

const REST_URL = "http://localhost:8000/mpd/";

export interface ArtistAlbums {
  artist: string
  albums: { year?: number, album: string }[]
}

export interface Song {
  album: string
  albumartist: string
  artist: string
  file: string
  title: string
  track: string
  pos: string
  id: string
}

@Injectable({
  providedIn: 'root'
})
export class MpdRestService {

  constructor(private http: HttpClient) {

  }

  getArtists() {
    return this.http.get<{ artist: string }[]>(
      REST_URL + "artists"
    ).pipe(
      map(
        (response) => response.map(i => i.artist)
      )
    )
  }

  getAlbums(artist: string) {
    return this.http.get<{ date: string, album: string[] | string }[]>(
      REST_URL + `albums?artist=${encodeURIComponent(artist)}`
    ).pipe(
      map(response => {
        let result: ArtistAlbums = { "artist": artist, albums: [] }
        for (let date of response) {

          if (Array.isArray(date.album)) {
            for (let album of date.album) {
              result.albums.push({
                year: date.date ? +(date.date.split("-")[0]) : undefined,
                album: album
              });
            }
          } else {
            result.albums.push({
              year: date.date ? +(date.date.split("-")[0]) : undefined,
              album: date.album
            });
          }
        }
        return result;
      })
    )
  }

  getSongs(artist: string, album: string) {
    return this.http.get<Song[]>(
      REST_URL + `songs?artist=${encodeURIComponent(artist)}&album=${encodeURIComponent(album)}`
    )
  }

  getCover(uri: string) {
    return this.http.get<{ cover: string }>(
      REST_URL + `cover?uri=${encodeURIComponent(uri)}`,
    )
  }

  enqueueAlbum(artist: string, album: string) {
    return this.getSongs(artist, album).pipe(
      map(songs => songs.map(s => s.file)),
      mergeMap(songs => this.http.post(REST_URL + 'enqueue', { uris: songs })),
    )
  }

  playlistInfo() {
    return this.http.get<Song[]>(REST_URL + "playlistInfo")
  }

  play(pos: number) {
    return this.http.get<null>(REST_URL + `play/${pos}`)
  }

  clear() {
    return this.http.get<null>(REST_URL + "clear")
  }
}
